require('dotenv').config()
const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  // Log the error with additional context
 
  // Handle specific error types
  const errorTypes = {
    CastError: {
      status: 400,
      message: 'Malformed ID',
      logMessage: 'Database Cast Error'
    },
    ValidationError: {
      status: 400,
      message: err.message,
      logMessage: 'Validation Error'
    },
    MongoServerError: {
      status: 400,
      message: 'Duplicate key error',
      condition: err.message.includes('E11000'),
      logMessage: 'MongoDB Duplicate Key Error'
    },
    JsonWebTokenError: {
      status: 401,
      message: 'Invalid token',
      logMessage: 'JWT Validation Error'
    },
    TokenExpiredError: {
      status: 401,
      message: 'Token expired',
      logMessage: 'JWT Expired Error'
    },
    UnauthorizedError: {
      status: 401,
      message: 'Unauthorized access',
      logMessage: 'Authorization Error'
    },
    ForbiddenError: {
      status: 403,
      message: 'Forbidden resource',
      logMessage: 'Access Forbidden Error'
    },
    NotFoundError: {
      status: 404,
      message: 'Resource not found',
      logMessage: 'Not Found Error'
    },
    ServiceUnavailableError: {
      status: 503,
      message: 'Service temporarily unavailable',
      expose: true
    },
    default: {
      status: 500,
      message: 'Something went wrong',
      logMessage: 'Internal Server Error'
    }
  };

  // Find matching error type or use default
  const errorType = Object.entries(errorTypes).find(([key, value]) => {
    if (key === 'MongoServerError') return err.name === key && value.condition;
    return err.name === key;
  }) || ['default', errorTypes.default];

  const [errorName, { status, message, logMessage }] = errorType;

  // log error with additional context 
   logger.error({
    message: err.message,
    error: err.name,
    stack:  process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    logMessage
  });

  
  // Send error response
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.message
    })
  });

  // Don't call next() as this is the final error handler
};

module.exports = errorHandler;
