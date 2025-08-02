const mongoose = require('mongoose');
const Assessment = require('../models/Assessment');
const Curriculum = require('../models/Curriculum');
const groqService = require('../services/groqService');
const logger = require('../../utils/logger');

class AssessmentController {
  async validateAssessment(req, res, next) {
    const { assessmentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid assessment ID format' 
      });
    }
    next();
  }

  async generateAssessment(req, res) {
    try {
      const { curriculumId } = req.body;
      const userId = req.user._id;

      const curriculum = await Curriculum.findById(curriculumId);
      if (!curriculum) {
        return res.status(404).json({
          success: false,
          message: 'Curriculum not found'
        });
      }

      const aiContext = {
        curriculum: {
          title: curriculum.metadata.topic,
          difficulty: curriculum.metadata.difficulty,
          modules: curriculum.modules.map(module => ({
            title: module.title,
            objectives: module.lessons.flatMap(lesson => lesson.learning_outcomes)
          }))
        }
      };

      const generatedAssessment = await groqService.generateContent(
        'assessmentGenerator',
        aiContext
      );

      // Normalize question types for frontend
      if (generatedAssessment.questions) {
        generatedAssessment.questions = generatedAssessment.questions.map(q => ({
          ...q,
          type: q.question_type // Map backend field to frontend expected field
        }));
      }

      const assessment = new Assessment({
        ...generatedAssessment,
        diagnostic: {
          ...generatedAssessment.diagnostic,
          knowledge_map: {
            ...generatedAssessment.diagnostic?.knowledge_map,
            dependency_graph: JSON.stringify(
              generatedAssessment.diagnostic?.knowledge_map?.dependency_graph || {}
            )
          }
        },
        target_curriculum: curriculumId,
        created_by: userId
      });

      await assessment.save();

      res.status(201).json({
        success: true,
        data: assessment,
        message: 'Assessment generated successfully'
      });

    } catch (error) {
      logger.error('Assessment generation error:', error);
      res.status(500).json({
        success: false,
        message: error.message.includes('JSON') 
          ? 'Invalid assessment structure from AI' 
          : 'Failed to generate assessment'
      });
    }
  }

  async getAssessment(req, res) {
    try {
      const assessment = await Assessment.findById(req.params.id)
        .populate('target_curriculum', 'metadata.title')
        .populate('created_by', 'name');

      if (!assessment) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found'
        });
      }

      // Normalize question types for frontend
      const normalizedAssessment = assessment.toObject();
      if (normalizedAssessment.questions) {
        normalizedAssessment.questions = normalizedAssessment.questions.map(q => ({
          ...q,
          type: q.question_type
        }));
      }

      res.json({
        success: true,
        data: normalizedAssessment
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  // In assessmentController.js, add:
async submitAssessment(req, res) {
  try {
    const { assessmentId } = req.params;
    const { responses, moduleId } = req.body;
    const userId = req.user._id;

    // Validate assessment
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    // Calculate score
    let score = 0;
    let totalPoints = 0;
    const detailedResponses = [];

    // Process questions based on assessment type
    let questions = [];
    let assessmentType = 'diagnostic'; // default
    
    if (assessment.diagnostic?.pre_test?.questions) {
      questions = assessment.diagnostic.pre_test.questions;
      assessmentType = 'diagnostic';
    } else if (assessment.formative) {
      questions = assessment.formative.questions || [];
      assessmentType = 'formative';
    } else if (assessment.summative) {
      questions = assessment.summative.questions || [];
      assessmentType = 'summative';
    }

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

    // Update Assessment with submission data
    assessment.submissions = assessment.submissions || [];
    assessment.submissions.push({
      user: userId,
      score: percentageScore,
      responses: detailedResponses,
      submitted_at: new Date()
    });
    await assessment.save();

    // Update UserProgress
    const updateObj = {
      $push: {
        "modules_progress.$.assessment_results": {
          assessment_id: assessmentId,
          assessment_type: assessmentType,
          score: percentageScore,
          responses: detailedResponses,
          date_completed: new Date()
        }
      },
      $set: {
        last_accessed: new Date(),
        status: percentageScore >= 80 ? 'in_progress' : 'paused'
      }
    };

    // Handle case where module progress doesn't exist yet
    if (moduleId) {
      await UserProgress.findOneAndUpdate(
        { 
          user_id: userId, 
          curriculum_id: assessment.target_curriculum,
          "modules_progress.module_id": moduleId
        },
        updateObj,
        { new: true }
      );
    } else {
      // If no moduleId, update at curriculum level
      await UserProgress.findOneAndUpdate(
        { 
          user_id: userId, 
          curriculum_id: assessment.target_curriculum
        },
        {
          $push: {
            assessment_results: {
              assessment_id: assessmentId,
              assessment_type: assessmentType,
              score: percentageScore,
              responses: detailedResponses,
              date_completed: new Date()
            }
          },
          $set: {
            last_accessed: new Date(),
            status: percentageScore >= 80 ? 'in_progress' : 'paused'
          }
        },
        { new: true, upsert: true }
      );
    }

    res.status(200).json({
      success: true,
      data: {
        score: percentageScore,
        feedback: this.generateFeedback(percentageScore),
        weak_areas: this.identifyWeakAreas(detailedResponses, assessment),
        assessment_id: assessmentId
      }
    });

  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Helper methods
checkAnswerCorrectness(question, userAnswer) {
  switch (question.question_type) {
    case 'mcq':
      return question.options.some(
        opt => opt.is_correct && opt.text === userAnswer
      );
    case 'true_false':
      return question.correct_answer === userAnswer;
    case 'short_answer':
      return question.correct_answer.toLowerCase() === userAnswer.toLowerCase();
    default:
      return false; // Essays need manual grading
  }
}

generateFeedback(score) {
  if (score >= 80) return 'Excellent understanding';
  if (score >= 60) return 'Good understanding with some gaps';
  return 'Needs significant improvement';
}

identifyWeakAreas(responses, assessment) {
  return responses
    .filter(r => !r.is_correct)
    .map(r => {
      const question = assessment.diagnostic.pre_test.questions.id(r.question_id);
      return question?.tags?.[0] || 'General Knowledge';
    });
}
}

module.exports = new AssessmentController();