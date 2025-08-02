const Recommendation = require("../models/Recommendation");
const UserProgress = require("../models/UserProgress");
const Curriculum = require("../models/Curriculum");
const groqService = require("../services/groqService");
const mongoose = require('mongoose');

class RecommendationController {
  async generateRecommendations(req, res) {
    try {
      const userId = req.user._id;
      const { conversationHistory, learningGoals } = req.body;

      // Validate input
      if (!conversationHistory || !Array.isArray(conversationHistory)) {
        return res.status(400).json({
          success: false,
          message: "Conversation history must be provided as an array"
        });
      }

      // Get user progress for context
      const userProgress = await UserProgress.find({ user_id: userId })
        .populate('curriculum_id', 'metadata.title modules')
        .lean();

      // Generate recommendations with Groq
      const recommendations = await groqService.generateContent(
        "recommendationEngine",
        {
          conversationHistory,
          currentProgress: userProgress,
          learningGoals: learningGoals || []
        }
      );

      // Process and validate recommendations
      const processedRecs = await this.processRecommendations(recommendations);

      // Save to database
      const newRecommendation = new Recommendation({
        ...processedRecs,
        user: userId,
        generated_at: new Date(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });

      await newRecommendation.save();

      res.status(201).json({
        success: true,
        data: newRecommendation,
        message: "Recommendations generated successfully"
      });
    } catch (error) {
      console.error("Recommendation generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message.includes('JSON') 
          ? 'Invalid recommendation structure from AI' 
          : 'Failed to generate recommendations'
      });
    }
  }

  async getUserRecommendations(req, res) {
    try {
      const recommendations = await Recommendation.find({ 
        user: req.user._id,
        expires_at: { $gt: new Date() } // Only non-expired
      })
        .sort({ generated_at: -1 })
        .limit(5)
        .populate('recommendations.immediate_next_steps.resource', 'title')
        .populate('compatibility.matched_resources', 'metadata.title');

      res.json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async processRecommendations(recommendations) {
  // Validate basic structure
  if (!recommendations.analysis || !recommendations.recommendations) {
    throw new Error("Invalid recommendation structure");
  }

  // Transform field names to match schema
  const processed = {
    analysis: {
      detected_skill_gaps: recommendations.analysis.skill_gaps || [],
      current_proficiency_level: recommendations.analysis.proficiency_level || 'Novice',
      learning_style_preferences: recommendations.analysis.learning_styles || []
    },
    recommendations: {
      immediate_next_steps: (recommendations.recommendations.short_term || []).map(step => ({
        topic: step.topic || "Untitled Topic",
        priority: ['High', 'Medium', 'Low'].includes(step.priority) 
          ? step.priority 
          : 'Medium',
        reason: step.expected_outcome || "Recommended for your learning path",
        estimated_time: "30 minutes", // Default if not provided
        resource: step.resources?.[0] || null,
        resource_model: step.resources?.[0] ? 'LessonContent' : null
      })),
      longer_term_path: (recommendations.recommendations.long_term || []).map(path => ({
        skill_domain: path.skill_domain || "General Skills",
        related_topics: [],
        milestones: path.roadmap || []
      }))
    },
    compatibility: {
      matched_resources: [],
      scheduled_availability: "30 minutes daily" // Default
    }
  };

  // Rest of your existing processing logic...
  if (recommendations.compatibility_score) {
    processed.compatibility.score = recommendations.compatibility_score;
  }

  return processed;
}
}

module.exports = new RecommendationController();