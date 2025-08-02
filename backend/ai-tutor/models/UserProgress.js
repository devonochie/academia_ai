// models/UserProgress.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ModuleProgressSchema = new Schema({
  module_id: { 
    type: String, 
    required: true 
  },
  completed_lessons: [{ 
    type: String, 
    required: true 
  }],
  last_accessed: { type: Date },
  assessment_results: [{
    assessment_id: { type: Schema.Types.ObjectId, ref: 'Assessment' },
    assessment_type: { type: String, enum: ['diagnostic', 'formative', 'summative'] },
    score: { type: Number },
    responses: [{
      question_id: { type: Schema.Types.ObjectId },
      answer: { type: Schema.Types.Mixed },
      is_correct: { type: Boolean }
    }],
    date_completed: { type: Date }
  }]
});

const UserProgressSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  curriculum_id: { type: Schema.Types.ObjectId, ref: 'Curriculum', required: true },
  modules_progress: { type: [ModuleProgressSchema], default: [] },
  current_module: { type: String },  
  current_lesson: { type: String },
  completion_percentage: { type: Number, default: 0 },
  started_at: { type: Date, default: Date.now },
  last_accessed: { type: Date, default: Date.now },
  completed_at: { type: Date },
  status: { type: String, enum: ['not_started', 'in_progress', 'paused', 'completed'], default: 'not_started' }
}, { timestamps: true });


UserProgressSchema.virtual('time_spent').get(function() {
  return this.last_accessed - this.started_at;
});

UserProgressSchema.methods.updateCompletion = function() {
  const totalLessons = 1; 
  const completed = this.modules_progress.reduce(
    (sum, mp) => sum + mp.completed_lessons.length, 0
  );
  this.completion_percentage = Math.round((completed / totalLessons) * 100);
  return this.completion_percentage;
};

// Add indexes
UserProgressSchema.index({ user_id: 1, curriculum_id: 1 });
UserProgressSchema.index({ status: 1, last_accessed: -1 });

module.exports = mongoose.model('UserProgress', UserProgressSchema);