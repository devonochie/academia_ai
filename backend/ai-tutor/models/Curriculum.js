// models/Curriculum.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const LessonComponentSchema = new Schema({
  type: { 
    type: String, 
    enum: ['concept', 'example', 'exercise'], 
    required: true 
  },
  title: { type: String, required: true },
  content: { type: String, required: true },
  sequence: { type: Number, required: true, min: 1 }
});

const LessonSchema = new Schema({
  lesson_id: { type: String, required: true },
  title: { type: String, required: true },
  duration_min: { 
    type: Number, 
    required: true,
    min: 15,
    max: 120 
  },
  learning_outcomes: { 
    type: [String], 
    required: true,
    validate: {
      validator: v => v.length >= 2,
      message: 'At least 2 learning outcomes required'
    }
  },
  components: {
    type: [LessonComponentSchema],
    required: true,
    validate: {
      validator: v => v.length >= 3,
      message: 'Each lesson must have at least 3 components'
    }
  }
});

const ModuleSchema = new Schema({
  module_id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  lessons: {
    type: [LessonSchema],
    required: true,
    validate: {
      validator: v => v.length >= 3,
      message: 'Each module must have at least 3 lessons'
    }
  }
});

const CurriculumSchema = new Schema({
  metadata: {
    topic: { type: String, required: true },
    difficulty: { 
      type: String, 
      enum: ['Novice', 'Intermediate', 'Expert'], 
      required: true 
    },
    total_estimated_hours: { 
      type: Number, 
      required: true,
      min: 1 
    },
    last_updated: { type: Date, default: Date.now }
  },
  overview: { type: String, required: true },
  modules: { 
    type: [ModuleSchema], 
    required: true,
    validate: {
      validator: v => v.length >= 3,
      message: 'Curriculum must have at least 3 modules'
    }
  },
  assessment_plan: {
    formative: { type: [String], required: true },
    summative: { type: [String], required: true }
  },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Curriculum', CurriculumSchema);