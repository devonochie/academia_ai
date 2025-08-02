const UserProgress = require('../models/UserProgress');
const Curriculum = require('../models/Curriculum');
const Recommendation = require('../models/Recommendation');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');


class ProgressController {
  constructor() {
    // Bind all methods that need 'this'
    this.updateProgress = this.updateProgress.bind(this);
    this.updateModuleProgress = this.updateModuleProgress.bind(this);
    this.updateCompletionStatus = this.updateCompletionStatus.bind(this);
    this.generateProgressBasedRecommendations = this.generateProgressBasedRecommendations.bind(this);
    this.analyzeWeakAreas = this.analyzeWeakAreas.bind(this);
    this.determineNextSteps = this.determineNextSteps.bind(this);
    this.calculateProficiencyLevel = this.calculateProficiencyLevel.bind(this);
    this.getLongTermPath = this.getLongTermPath.bind(this);
  }
  async updateProgress(req, res) {
    try {
      const { curriculumId, moduleId, lessonId, status, quizResult } = req.body;
      const userId = req.user._id;

      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      // Validate ObjectIDs
      if (!mongoose.Types.ObjectId.isValid(curriculumId) || 
          !mongoose.Types.ObjectId.isValid(moduleId) || 
          !mongoose.Types.ObjectId.isValid(lessonId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format"
        });
      }

      // Get curriculum for validation
      const curriculum = await Curriculum.findById(curriculumId);
      if (!curriculum) {
        return res.status(404).json({
          success: false,
          message: "Curriculum not found"
        });
      }

      // Find or initialize progress
      let progress = await UserProgress.findOne({
        user_id: userId,
        curriculum_id: curriculumId
      }).populate({
        path: 'curriculum_id',
        select: 'modules'
      });

      if (!progress) {
        // Fetch curriculum to get modules
        const curriculumData = await Curriculum.findById(curriculumId).select('modules');
        progress = new UserProgress({
          user_id: userId,
          current_lesson: lessonId,
          current_module: moduleId,
          curriculum_id: curriculumId,
          status: 'in_progress',
          modules_progress: curriculumData
        ? curriculumData.modules.map(module => ({
            module_id: module._id,
            completed_lessons: [],
            last_accessed: new Date()
          }))
        : []
        });
      }

      // Update module progress
      this.updateModuleProgress(progress, moduleId, lessonId, status, quizResult);

      // Calculate and update completion
      this.updateCompletionStatus(progress, curriculum);

      // Save progress
      await progress.save();

      // Generate recommendations if lesson was completed
      if (status === 'completed') {
        await this.generateProgressBasedRecommendations(userId, curriculumId);
      }

      res.json({
        success: true,
        data: progress,
        message: 'Progress updated successfully'
      });

    } catch (error) {
      console.error('Progress update error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUserProgress(req, res) {
    try {
      const progressRecords = await UserProgress.find({ 
        user_id: req.user._id 
      })
        .populate({
          path: 'curriculum_id',
          select: 'metadata.title metadata.topic metadata.difficulty metadata.total_estimated_hours metadata.last_updated modules',
          populate: {
        path: 'modules.lessons',
        select: 'title description'
          }
        })
        .populate({
          path: 'current_module',
          select: 'title description lessons',
          populate: {
        path: 'lessons',
        select: 'title description'
          }
        })
        .populate({
          path: 'current_lesson',
          select: 'title description'
        })
        .sort({ last_accessed: -1 });

      const overallProgress = ProgressController.calculateOverallProgress(progressRecords)

      res.json({
        success: true,
        data: {
          progress: progressRecords,
          overallProgress,
          totalInProgress: progressRecords.filter(p => p.status === 'in_progress').length,
          totalCompleted: progressRecords.filter(p => p.status === 'completed').length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Helper Methods
  updateModuleProgress(progress, moduleId, lessonId, status, quizResult) {
    let moduleProgress = progress.modules_progress.find(
      mp => mp.module_id.toString() === moduleId.toString()
    );

    if (!moduleProgress) {
      moduleProgress = {
        module_id: moduleId,
        completed_lessons: [],
        last_accessed: new Date()
      };
      progress.modules_progress.push(moduleProgress);
    }

    // Update lesson completion
    if (status === 'completed' && 
        !moduleProgress.completed_lessons.map(id => id.toString()).includes(lessonId.toString())) {
      moduleProgress.completed_lessons.push(lessonId);
    }

    // Update quiz results
    if (quizResult) {
      moduleProgress.quiz_scores = moduleProgress.quiz_scores || [];
      moduleProgress.quiz_scores.push({
        quiz_id: quizResult.quizId,
        score: quizResult.score,
        date_completed: new Date()
      });
    }

    // Update access timestamps
    moduleProgress.last_accessed = new Date();
    progress.last_accessed = new Date();
    progress.current_module = moduleId;
    progress.current_lesson = lessonId;
  }

  updateCompletionStatus(progress, curriculum) {
    const totalLessons = curriculum.modules.reduce(
      (sum, module) => sum + module.lessons.length, 0
    );

    const completedLessons = progress.modules_progress.reduce(
      (sum, mp) => sum + mp.completed_lessons.length, 0
    );

    progress.completion_percentage = Math.round(
      (completedLessons / totalLessons) * 100
    );

    // Update overall status
    if (progress.completion_percentage >= 100) {
      progress.status = 'completed';
      progress.completed_at = new Date();
    } else if (progress.completion_percentage > 0) {
      progress.status = 'in_progress';
    } else {
      progress.status = 'not_started';
    }
  }

  static calculateOverallProgress(progressRecords) {
    if (progressRecords.length === 0) return 0;
    
    const validRecords = progressRecords.filter(p => p.completion_percentage !== undefined);
    if (validRecords.length === 0) return 0;

    const total = validRecords.reduce(
      (sum, curr) => sum + (curr.completion_percentage || 0), 0
    );
    
    return Math.round(total / validRecords.length);
  }

  async generateProgressBasedRecommendations(userId, curriculumId) {
    try {
      const progress = await UserProgress.findOne({
        user_id: userId,
        curriculum_id: curriculumId
      }).populate('curriculum_id');

      if (!progress || !progress.curriculum_id) return;

      const weakAreas = this.analyzeWeakAreas(progress);
      const nextSteps = this.determineNextSteps(progress);

      const recommendation = new Recommendation({
        user: userId,
        analysis: {
          detected_skill_gaps: weakAreas.map(area => area.module),
          current_proficiency_level: this.calculateProficiencyLevel(progress),
          learning_style_preferences: []
        },
        recommendations: {
          immediate_next_steps: nextSteps,
          longer_term_path: this.getLongTermPath(progress.curriculum_id)
        },
        compatibility: {
          matched_resources: [curriculumId],
          scheduled_availability: "30 minutes daily"
        },
        generated_at: new Date(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      await recommendation.save();
    } catch (error) {
      console.error('Recommendation generation error:', error);
    }
  }

  analyzeWeakAreas(progress) {
    const weakAreas = [];
    const curriculum = progress.curriculum_id;

    curriculum.modules.forEach(module => {
      const moduleProgress = progress.modules_progress.find(
        mp => mp.module_id.toString() === module._id.toString()
      );
      
      const completionRatio = moduleProgress 
        ? moduleProgress.completed_lessons.length / module.lessons.length
        : 0;

      if (completionRatio < 0.5) {
        weakAreas.push({
          module: module.title,
          completion: Math.round(completionRatio * 100),
          suggestedActions: [
            'Review module materials',
            'Retake module quiz',
            'Practice with additional exercises'
          ]
        });
      }
    });

    return weakAreas;
  }

  determineNextSteps(progress) {
    const curriculum = progress.curriculum_id;
    const nextSteps = [];
    
    // Find first incomplete module
    for (const module of curriculum.modules) {
      const moduleProgress = progress.modules_progress.find(
        mp => mp.module_id.toString() === module._id.toString()
      );
      
      if (!moduleProgress || moduleProgress.completed_lessons.length < module.lessons.length) {
        // Find first incomplete lesson
        for (const lesson of module.lessons) {
          if (!moduleProgress || 
              !moduleProgress.completed_lessons.includes(lesson._id.toString())) {
            nextSteps.push({
              topic: lesson.title,
              priority: 'High',
              reason: 'Next lesson in your learning path',
              estimated_time: `${lesson.duration_min} minutes`,
              resource: lesson._id,
              resource_model: 'LessonContent' // Changed from 'Lesson'
            });
            return nextSteps;
          }
        }
      }
    }

    // If all completed, suggest assessment
    nextSteps.push({
      topic: 'Final Assessment',
      priority: 'High',
      reason: 'You have completed all lessons',
      estimated_time: '60 minutes',
      action: 'Take Final Assessment'
    });

    return nextSteps;
  }

  calculateProficiencyLevel(progress) {
  if (progress.completion_percentage >= 80) return 'Expert';
  if (progress.completion_percentage >= 50) return 'Intermediate';
  return 'Novice';
}

  getLongTermPath(curriculum) {
    return [{
      skill_domain: curriculum.metadata.topic,
      related_topics: curriculum.metadata.related_topics || [],
      milestones: [
        'Complete all modules',
        'Pass final assessment',
        'Apply skills in practical project'
      ]
    }];
  }
}

module.exports = new ProgressController();