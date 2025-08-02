// models/Assessment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
  question_text: { type: String, required: true },
  question_type: { type: String, enum: ['mcq', 'true_false', 'short_answer', 'essay'], required: true },
  options: [{ 
    text: String,
    is_correct: Boolean
  }],
  correct_answer: { type: String },
  points: { type: Number, default: 1 },
  feedback: { type: String }
});

const AssessmentSchema = new Schema({
  diagnostic: {
    pre_test: {
      questions: { type: [QuestionSchema], required: true },
      scoring_metric: { type: String, enum: ['Percentage', 'Rubric'], required: true }
    },
    knowledge_map: {
      core_competencies: { type: [String], required: true },
      dependency_graph: { type: Schema.Types.Mixed }
    }
  },
  formative: {
    feedback_mechanisms: [{
      type: { type: String, enum: ['quiz', 'project', 'peer_review'], required: true },
      frequency: { type: String, enum: ['per_module', 'weekly', 'biweekly'], required: true },
      criteria: { type: [String], required: true }
    }]
  },
  submissions: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number },
    responses: [{
      question_id: { type: Schema.Types.ObjectId },
      answer: { type: Schema.Types.Mixed },
      is_correct: { type: Boolean }
    }],
    submitted_at: { type: Date, default: Date.now }
  }],
  
  summative: {
    capstone_requirements: {
      deliverables: { type: [String], required: true },
      evaluation_matrix: {
        dimensions: { type: [String], required: true },
        weightings: { type: [Number], required: true }
      }
    }
  },
  adaptive_learning: {
    remediation_paths: {
      weak_areas: { type: [String], required: true }
    },
    acceleration_options: {
      advanced_materials: { type: [String], required: true }
    }
  },
  target_curriculum: { type: Schema.Types.ObjectId, ref: 'Curriculum' },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', AssessmentSchema);