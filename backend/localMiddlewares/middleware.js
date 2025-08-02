const jwt = require('jsonwebtoken') 
const logger = require('../utils/logger')
const User = require('../authservice/model/auth')

module.exports = {
   tokenExtractor: (req, res, next) => {
      const auth = req.get('authorization')
      if(auth && auth.startsWith('Bearer ')) {
         req.token = auth.substring(7).trim()
      } else {
         req.token = null
      }
      next()
   },
   authMiddleware: async (req, res, next) => {
      try {
         // Get token from cookies instead of headers
         const token = req.cookies.accessToken 

         if (!token) {
            return res.status(401).json({ error: 'No token provided' });
         }

         const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
         const user = await User.findById(decoded.user_id);

         if (!user) {
            return res.status(401).json({ error: 'User not found' });
         }

         req.user = user;
         next();
      } catch (error) {
         logger.error('Invalid or expired token:', error);
         return res.status(401).json({ error: 'Invalid or expired token' });
      }
   },
   unknownEndPoint: (req, res, next) => {
      res.status(400).json({
         error: 'Unknown endPoint'
      })
   },
   requestLogger: (req, res, next) => {
      logger.info('---')
      logger.info('Method:', req.method)
      logger.info('Path:', req.path)
      logger.info('Body:', req.body)
      logger.info('---')
      next()
   },
  
   

}