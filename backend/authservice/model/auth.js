const mongoose = require('mongoose')
const { Schema, model } = mongoose

const LearningPreferenceSchema = new Schema({
  style: { type: String, enum: ['Visual', 'Auditory', 'Kinesthetic'] },
  strength: { type: Number, min: 1, max: 10 }
});

const userSchema = new Schema({
  name: { type: String, minLength:4  },
  email: { type: String, required: true, minLength: 6, unique: true},
  password: { type: String, required: true, minLength: 8, unique: true},
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  refreshTokens: [
    {
        token: { type: String},
        expiresAt: { type: Date, default: Date.now}
    }
   ],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date, default: Date.now },
  learning_preferences: { type: [LearningPreferenceSchema] },
  known_skills: [{
    skill: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] }
  }],
  learning_goals: [{
    goal: { type: String, required: true },
    target_date: { type: Date },
    priority: { type: String, enum: ['low', 'medium', 'high'] }
  }],
  completed_curricula: [{ 
    curriculum: { type: Schema.Types.ObjectId, ref: 'Curriculum' },
    completion_date: { type: Date },
    certificate_earned: { type: Boolean }
  }],
  is_active: { type: Boolean, default: true },
  last_login: { type: Date },
  metadata: {
    timezone: { type: String },
    preferred_language: { type: String, default: 'en' }
  }
},{ timestamps: true })


userSchema.set('toJSON', {
   transform: (_, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject._v
      delete returnedObject.password 
   }
})

const User = model('User', userSchema)
module.exports = User