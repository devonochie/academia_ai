const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');


// Robust rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, 
  standardHeaders: true, 
  legacyHeaders: false, 

  message: {
    status: 429,
    error: 'Too many requests, please try again later.',
  },

  handler: (req, res, next, options) => {
    logger.warn(`Rate limit hit: ${req.ip} on ${req.originalUrl}`);
    res.status(options.statusCode).json(options.message);
  },

  skipSuccessfulRequests: false, 
});

module.exports = limiter;
