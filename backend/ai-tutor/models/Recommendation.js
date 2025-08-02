// models/Recommendation.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecommendationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  analysis: {
    detected_skill_gaps: { type: [String], required: true },
    current_proficiency_level: { type: String, enum: ['Novice', 'Intermediate', 'Expert'] },
    learning_style_preferences: { type: [String], enum: ['Visual', 'Auditory', 'Kinesthetic'], required: true }
  },
  recommendations: {
    immediate_next_steps: [{
      topic: { type: String, required: true },
      priority: { type: String, enum: ['High', 'Medium', 'Low'], required: true },
      reason: { type: String, required: true },
      estimated_time: { type: String, required: true },
      resource: { type: Schema.Types.ObjectId, refPath: 'recommendations.immediate_next_steps.resource_model' },
      resource_model: { type: String, enum: ['Curriculum', 'LessonContent'] }
    }],
    longer_term_path: [{
      skill_domain: { type: String, required: true },
      related_topics: { type: [String], required: true },
      milestones: { type: [String], required: true }
    }]
  },
  // Add these to the enum lists if you want to support more values:
  current_proficiency_level: { 
    type: String, 
    enum: ['Novice', 'Intermediate', 'Advanced', 'Expert'],
    default: 'Novice'
  },
  resource_model: { 
    type: String, 
    enum: ['Curriculum', 'LessonContent',  'Module'] 
  },
  compatibility: {
    matched_resources: [{ type: Schema.Types.ObjectId, ref: 'Curriculum' }],
    scheduled_availability: { type: String }
  },
  generated_at: { type: Date, default: Date.now },
  expires_at: { type: Date, required: true }
});

// Add these to the RecommendationSchema:
RecommendationSchema.pre('save', function(next) {
  if (this.expires_at <= this.generated_at) {
    throw new Error('Expiration date must be after generation date');
  }
  
  // Validate resource matches resource_model
  this.recommendations.immediate_next_steps.forEach(step => {
    if (step.resource && !step.resource_model) {
      throw new Error('Resource model must be specified when resource is provided');
    }
  });
  next();
});

// Add indexes
RecommendationSchema.index({ user: 1, 'analysis.current_proficiency_level': 1 });
RecommendationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Recommendation', RecommendationSchema);