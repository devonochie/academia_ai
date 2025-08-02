// controllers/curriculumController.js
const tutorCourseMessage = require("../../messages/tutorMessage");
const Curriculum = require("../models/Curriculum");
const groqService = require("../services/groqService");

const validateCurriculumInput = (req, res, next) => {
  const { topic, difficulty } = req.body;
  
  if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
    return res.status(400).json({ 
      success: false,
      message: 'Topic must be at least 3 characters long' 
    });
  }

  if (!['Novice', 'Intermediate', 'Expert'].includes(difficulty)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid difficulty level' 
    });
  }

  next();
};

class CurriculumController {
  async generateCurriculum(req, res) {
    try {
      const { topic, difficulty, preferences } = req.body;
      
      // Validate input
      await validateCurriculumInput(req, res, () => {});

      // Check if curriculum exists
      const existingCurriculum = await Curriculum.findOne({ 
        topic: { $regex: new RegExp(topic, 'i') }, 
        difficulty 
      });

      if (existingCurriculum) {
        return res.status(200).json({
          success: true,
          data: existingCurriculum,
          message: "Existing curriculum retrieved successfully"
        });
      }

      // Generate with Groq (with retry logic)
      let curriculumData;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          curriculumData = await groqService.generateContent(
            "curriculumGenerator", 
            { topic, difficulty },
            preferences
          );
          break;
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw new Error(`Failed after ${maxAttempts} attempts: ${error.message}`);
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }

      // Save to database
      const curriculum = new Curriculum({
        ...curriculumData,
        created_by: req.user._id
      });

      await curriculum.save();

      // Send notification
      await tutorCourseMessage(req.user, curriculum);

      res.status(201).json({
        success: true,
        data: curriculum,
        message: "Curriculum generated successfully"
      });
    } catch (error) {
      console.error("Curriculum generation error:", error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCurriculum(req, res) {
    try {
      const curriculum = await Curriculum.findById(req.params.id)
        .populate('created_by', 'name email');
      
      if (!curriculum) {
        return res.status(404).json({ 
          success: false,
          message: "Curriculum not found" 
        });
      }

      res.json({
        success: true,
        data: curriculum
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCurricula(req, res) {
    try {
      const curricula = await Curriculum.find({ created_by: req.user._id })
        .populate('created_by', 'name email')
        .sort({ createdAt: -1 }); 
      
      res.json({
        success: true,
        data: curricula
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateCurriculum(req, res) {
    try {
      const curriculum = await Curriculum.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!curriculum) {
        return res.status(404).json({ 
          success: false,
          message: "Curriculum not found" 
        });
      }

      res.json({
        success: true,
        data: curriculum,
        message: "Curriculum updated successfully"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new CurriculumController();