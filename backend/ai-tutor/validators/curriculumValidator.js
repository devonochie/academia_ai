// validators/curriculumValidator.js
const Joi = require("joi");

const curriculumGenerationSchema = Joi.object({
  topic: Joi.string().required().min(5).max(100),
  difficulty: Joi.string().valid("Novice", "Intermediate", "Expert").required(),
  preferences: Joi.object({
    learningStyle: Joi.string().valid("Visual", "Auditory", "Kinesthetic"),
    depth: Joi.string().valid("Overview", "Detailed", "Comprehensive"),
    examples: Joi.boolean()
  }).optional()
});

const validateCurriculumInput = (data) => {
  return curriculumGenerationSchema.validate(data, { abortEarly: false });
};

module.exports = { validateCurriculumInput };