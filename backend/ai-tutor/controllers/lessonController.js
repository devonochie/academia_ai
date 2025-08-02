const LessonContent = require("../models/LessonContent");
const Curriculum = require("../models/Curriculum");
const groqService = require("../services/groqService");

class LessonController {
  async generateLessonContent(req, res) {
    try {
      const { curriculumId, moduleId, lessonId } = req.params;
      const { preferences } = req.body;

      // Validate input
      if (!lessonId) {
        return res.status(400).json({ 
          success: false,
          message: "Lesson ID is required" 
        });
      }

      // Check for existing content
      const existingContent = await LessonContent.findOne({
        related_curriculum: curriculumId,
        lesson_id: lessonId
      });

      if (existingContent) {
        return res.status(200).json({
          success: true,
          data: existingContent,
          message: "Lesson content already exists"
        });
      }

      // Get curriculum context
      const curriculum = await Curriculum.findById(curriculumId);
      if (!curriculum) {
        return res.status(404).json({ 
          success: false,
          message: "Curriculum not found" 
        });
      }

      // Find the specific lesson
      const module = curriculum.modules.find(m => m.module_id === moduleId);
      if (!module) {
        return res.status(404).json({ 
          success: false,
          message: "Module not found" 
        });
      }

      const lesson = module.lessons.find(l => l.lesson_id === lessonId);
      if (!lesson) {
        return res.status(404).json({ 
          success: false,
          message: "Lesson not found" 
        });
      }
      // Get lesson title and learning outcomes
      const lessonTitle = lesson.title || "Untitled Lesson";

      // Generate content
      const lessonContent = await groqService.generateContent(
        "lessonGenerator",
        {
          topic: curriculum.metadata.topic,
          difficulty: curriculum.metadata.difficulty
        },
        {
          ...preferences,
          lessonTitle: lesson.title,
          learningOutcomes: lesson.learning_outcomes
        }
      );

      // Transform data to match schema
      if (lessonContent.core_content?.theoretical_foundation?.detailed_explanation) {
        if (typeof lessonContent.core_content.theoretical_foundation.detailed_explanation !== 'string') {
          lessonContent.core_content.theoretical_foundation.detailed_explanation = 
            JSON.stringify(lessonContent.core_content.theoretical_foundation.detailed_explanation);
        }
      }

          // Replace the content transformation section with:
      const transformLessonContent = (content) => {
        // Ensure detailed_explanation is properly stringified
        if (content.core_content?.theoretical_foundation?.detailed_explanation) {
          if (typeof content.core_content.theoretical_foundation.detailed_explanation !== 'string') {
            content.core_content.theoretical_foundation.detailed_explanation = 
              JSON.stringify(content.core_content.theoretical_foundation.detailed_explanation);
          }
        }

        // Transform common_misconceptions to ensure proper structure
        content.supplemental = content.supplemental || {};
        content.supplemental.common_misconceptions = 
          (content.supplemental.common_misconceptions || []).map(item => ({
            misconception: item.misconception || "Common misconception",
            explanation: item.explanation || "Explanation not provided"
          }));

        // Transform further_reading
        content.supplemental.further_reading = 
          (content.supplemental.further_reading || []).map(item => ({
            title: item.title || "Untitled resource",
            url: item.url || "#",
            type: item.type || "Article"
          }));

        return content;
      };

      // Then use it in generateLessonContent:
      const transformedContent = transformLessonContent(lessonContent);
      const newLessonContent = new LessonContent({
        ...transformedContent,
        related_curriculum: curriculumId,
        lesson_id: lessonId,
        version: 1,
        lesson_topic: lessonTitle.trim(),

      });
      await newLessonContent.save();

      return res.status(201).json({
        success: true,
        title: lesson.title.trim(),
        data: newLessonContent,
        message: "Lesson content generated successfully"
      });

    } catch (error) {
      console.error("Error generating lesson content:", error);
      
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Lesson content for this curriculum and lesson ID already exists"
        });
      }

      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getLessonContent(req, res) {
    try {
      const { curriculumId, lessonId } = req.params;

      if (!lessonId) {
        return res.status(400).json({ 
          success: false,
          message: "Lesson ID is required" 
        });
      }

      const lessonContent = await LessonContent.findOne({
        related_curriculum: curriculumId,
        lesson_id: lessonId
      }).populate('related_curriculum', 'metadata.title');

      if (!lessonContent) {
        // The lesson exists, but the content does not
        return res.status(404).json({ 
          success: false,
          message: "Lesson content not found, but lesson exists" 
        });
      }

      return res.json({ 
        success: true, 
        data: lessonContent 
      });

    } catch (error) {
      console.error("Error fetching lesson content:", error);
      return res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }
  async submitLessonAssessment(req, res) {
  try {
    const { curriculumId, moduleId, lessonId } = req.params;
    const { responses } = req.body;
    const userId = req.user._id;

    // Validate lesson content exists
    const lessonContent = await LessonContent.findOne({
      related_curriculum: curriculumId,
      lesson_id: lessonId
    });

    if (!lessonContent) {
      return res.status(404).json({
        success: false,
        message: "Lesson content not found"
      });
    }

    // Get or create assessment reference
    let assessment = await Assessment.findOne({
      target_curriculum: curriculumId,
      "formative.questions.lesson_id": lessonId
    });

    const questions = lessonContent.assessment.knowledge_check.questions;
    
    if (!assessment) {
      assessment = new Assessment({
        formative: {
          questions: questions.map(q => ({
            ...q,
            lesson_id: lessonId
          })),
          feedback_mechanisms: [{
            type: 'quiz',
            frequency: 'per_module',
            criteria: lessonContent.lesson_meta.learning_outcomes || []
          }]
        },
        target_curriculum: curriculumId,
        created_by: userId
      });
    } else {
      // Add new questions if they don't exist
      questions.forEach(newQ => {
        if (!assessment.formative.questions.some(q => q._id.equals(newQ._id))) {
          assessment.formative.questions.push({
            ...newQ,
            lesson_id: lessonId
          });
        }
      });
    }

    // Calculate score and prepare responses
    let score = 0;
    let totalPoints = 0;
    const detailedResponses = [];

    questions.forEach((question, index) => {
      totalPoints += question.points || 1;
      const userAnswer = responses[index];
      const isCorrect = this.checkAnswerCorrectness(question, userAnswer);
      
      if (isCorrect) {
        score += question.points || 1;
      }

      detailedResponses.push({
        question_id: question._id,
        answer: userAnswer,
        is_correct: isCorrect
      });
    });

    const percentageScore = Math.round((score / totalPoints) * 100);

    // Save submission to Assessment
    assessment.submissions = assessment.submissions || [];
    assessment.submissions.push({
      user: userId,
      score: percentageScore,
      responses: detailedResponses,
      submitted_at: new Date(),
      lesson_id: lessonId
    });
    await assessment.save();

    // Update UserProgress
    await UserProgress.findOneAndUpdate(
      { 
        user_id: userId, 
        curriculum_id: curriculumId,
        "modules_progress.module_id": moduleId
      },
      {
        $push: {
          "modules_progress.$.assessment_results": {
            assessment_id: assessment._id,
            assessment_type: 'formative',
            score: percentageScore,
            responses: detailedResponses,
            date_completed: new Date()
          }
        },
        $set: {
          last_accessed: new Date(),
          status: percentageScore >= 80 ? 'in_progress' : 'paused',
          "modules_progress.$.last_accessed": new Date()
        }
      },
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      data: {
        score: percentageScore,
        feedback: this.generateFeedback(percentageScore),
        weak_areas: this.identifyWeakAreas(detailedResponses, lessonContent),
        assessment_id: assessment._id
      }
    });

  } catch (error) {
    console.error("Error submitting lesson assessment:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

  // Helper methods
  checkAnswerCorrectness(question, userAnswer) {
    if (question.type === 'mcq') {
      return question.options.find(opt => opt.text === userAnswer)?.is_correct;
    }
    return userAnswer === question.model_answer;
  }

  generateFeedback(score) {
    if (score >= 90) return "Excellent mastery of the material";
    if (score >= 70) return "Good understanding with minor gaps";
    if (score >= 50) return "Basic understanding, needs more practice";
    return "Needs significant review of the material";
  }

  identifyWeakAreas(responses, lessonContent) {
    const incorrectQuestions = responses.filter(r => !r.is_correct);
    return [...new Set(
      incorrectQuestions.map(rq => {
        const question = lessonContent.assessment.knowledge_check.questions.find(
          q => q._id.equals(rq.question_id)
        );
        return question?.learning_outcome || "General Concepts";
      })
    )];
  }
}

module.exports = new LessonController();