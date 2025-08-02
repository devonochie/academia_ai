const express = require('express')
const authController = require('../authservice/controllers/authController')
const routes = express.Router()
const multer = require('multer')
const path = require('path');
const middleware = require('../localMiddlewares/middleware')
const curriculumController = require('../ai-tutor/controllers/curriculumController')
const lessonController = require('../ai-tutor/controllers/lessonController')
const recommendationController = require('../ai-tutor/controllers/recommendationController')
const assessmentController = require('../ai-tutor/controllers/assessmentController')
const progressController = require('../ai-tutor/controllers/progressController')
const { check } = require('express-validator');
const paraController = require('../paraphraser/controller/paraController');


const upload = multer({ 
    storage: multer.memoryStorage(), // Store files in memory for processing
    limits: { fileSize: 10 * 1024 * 1024, files: 1 } ,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.md'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOC, DOCX, TXT, and MD files are allowed.'));
        }
    }
 }) // Configure multer for file uploads



// auth routes
routes.post('/auth/register', authController.register)
routes.post('/auth/login', authController.login)
routes.get('/auth/me', middleware.authMiddleware, authController.me); 
routes.post('/auth/logout', authController.logout)
routes.post('/auth/forgot-password', authController.forgotPassword)
routes.post('/auth/reset-password/:token', authController.resetPassword)
routes.post('/auth/refresh-token', authController.refreshToken)

// Curriculum routes
routes.post("/curricula/generate",middleware.authMiddleware, curriculumController.generateCurriculum);
routes.get("/curricula/:id",middleware.authMiddleware, curriculumController.getCurriculum);
routes.get("/curricula",middleware.authMiddleware, curriculumController.getCurricula);
routes.put("/curricula/:id",middleware.authMiddleware, curriculumController.updateCurriculum);

// Lesson routes
routes.post(
  "/curricula/:curriculumId/modules/:moduleId/lessons/:lessonId/generate-content",
  middleware.authMiddleware,
  lessonController.generateLessonContent
);
routes.post(
  "/curricula/:curriculumId/modules/:moduleId/lessons/:lessonId/assessment",
  middleware.authMiddleware,
  lessonController.submitLessonAssessment
);

routes.get(
  "/curricula/:curriculumId/lessons/:lessonId/content",
  middleware.authMiddleware,
  lessonController.getLessonContent
);


// Recommendation routes
routes.post("/recommendations",middleware.authMiddleware, recommendationController.generateRecommendations);
routes.get("/recommendations",middleware.authMiddleware, recommendationController.getUserRecommendations);

// Assessment routes
routes.post('/assessments/generate', middleware.authMiddleware, assessmentController.generateAssessment);
routes.get('//assessments/:id', middleware.authMiddleware, assessmentController.getAssessment);
// In your routes file:
routes.post('/assessments/:assessmentId/submit', 
  middleware.authMiddleware, 
  assessmentController.validateAssessment,
  assessmentController.submitAssessment
);

// Progress routes
routes.post('/progress', [
  middleware.authMiddleware,
  check('curriculumId').isMongoId().withMessage('Invalid curriculum ID'),
  check('moduleId').isMongoId().withMessage('Invalid module ID'),
  check('lessonId').isString().notEmpty().withMessage('Invalid lesson ID'),
  check('status').isIn(['started', 'completed']).withMessage('Invalid status')
], progressController.updateProgress);

routes.get('/progress',middleware.authMiddleware, progressController.getUserProgress);

// praphraser routes
routes.post('/paraphrase', middleware.authMiddleware, paraController.paraphraseContent);
routes.post('/paraphrase/batch', middleware.authMiddleware, paraController.batchParaphrase)
routes.post('/paraphrase/document', middleware.authMiddleware, upload.single('file'), paraController.paraphraseDocument);

module.exports = routes