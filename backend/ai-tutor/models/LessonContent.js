const mongoose = require('mongoose');
const { Schema } = mongoose;

const CaseStudySchema = new Schema({
  title: { type: String, required: true },
  problem: { type: String, required: true },
  solution: { type: Schema.Types.Mixed, required: true },
  key_takeaways: { type: [String], required: true }
});

const QuestionSchema = new Schema({
  type: { 
    type: String, 
    enum: ['mcq', 'true_false', 'short_answer'], 
    required: true 
  },
  stem: { type: String, required: true },
  options: { type: [String] },
  model_answer: { type: String, required: true },
  feedback: { type: String } 
});

const LessonContentSchema = new Schema({
  lesson_meta: {
    target_audience: { 
      type: String, 
      enum: ['Novice', 'Intermediate', 'Expert'], 
      required: true 
    },
    prerequisites: { type: [String], required: true },
    pedagogical_approach: { 
      type: String, 
      enum: ['Conceptual', 'Practical', 'Theoretical', 'Visual'], 
      required: true 
    },
  },
  learning_outcomes: {
    type: [String],
    required: true,
    validate: {
      validator: v => v.length >= 2,
      message: 'At least 2 learning outcomes required'
    }
  },
  lesson_topic: {
    type: String,
  },
  duration_estimate: {
    type: Number,
    required: true,
  },
  core_content: {
    theoretical_foundation: {
      key_concepts: { type: [String], required: true },
      detailed_explanation: { type: Schema.Types.Mixed, required: true },
      formulas: { type: [String] }
    },
    applied_learning: {
      case_studies: { type: [CaseStudySchema], required: true },
      interactive_elements: {
        demonstration: { type: Schema.Types.Mixed },
        simulation_prompt: { type: Schema.Types.Mixed }
      }
    }
  },
  assessment: {
    knowledge_check: {
      questions: { type: [QuestionSchema], required: true }
    },
    applied_activity: {
      title: { type: String, required: true },
      instructions: { type: Schema.Types.Mixed, required: true },
      evaluation_rubric: { type: [String], required: true }
    }
  },
  supplemental: {
    further_reading: { 
      type: [{
        title: String,
        url: String
      }],
      default: []
    },
    common_misconceptions: {
      type: [{
        misconception: { type: String, required: true },
        explanation: { type: String, required: true }
      }],
      default: [],
      validate: {
        validator: function(v) {
          return v.every(item => 
            item && 
            typeof item.misconception === 'string' && 
            typeof item.explanation === 'string'
          );
        },
        message: props => `Each misconception must have both 'misconception' and 'explanation' fields`
      }
    }
  },
  related_curriculum: { 
    type: Schema.Types.ObjectId, 
    ref: 'Curriculum',
    required: true
  },
   lesson_id: { type: String, required: true },
  version: { 
    type: Number, 
    default: 1 
  }
}, { 
  timestamps: true 
});

// Compound unique index
LessonContentSchema.index(
  { related_curriculum: 1, lesson_id: 1 }, 
  { unique: true }
);

module.exports = mongoose.model('LessonContent', LessonContentSchema);