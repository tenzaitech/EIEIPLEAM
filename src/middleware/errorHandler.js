/**
 * 🛡️ Error Handler Middleware
 * Centralized error handling for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Global error handler with detailed error responses
 */

const { logger, CustomLogger } = require('../utils/logger');

// ========================================
// ERROR TYPES DEFINITION
// ========================================
class AppError extends Error {
  constructor(message, statusCode, errorCode = null, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
  }
}

class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

// ========================================
// ERROR RESPONSE FORMATTER
// ========================================
const formatErrorResponse = (error, req) => {
  const baseResponse = {
    success: false,
    error: {
      code: error.errorCode || 'INTERNAL_SERVER_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: error.details || [],
    },
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Add request ID if available
  if (req.id) {
    baseResponse.requestId = req.id;
  }

  // Add user information if available
  if (req.user) {
    baseResponse.error.userId = req.user.id;
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development' && error.stack) {
    baseResponse.error.stack = error.stack;
  }

  return baseResponse;
};

// ========================================
// ERROR LOGGING
// ========================================
const logError = (error, req) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
    statusCode: error.statusCode || 500,
    errorCode: error.errorCode,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    body: req.body,
    query: req.query,
    params: req.params,
  };

  // Log security-related errors
  if (error.statusCode === 401 || error.statusCode === 403) {
    CustomLogger.logSecurityEvent('AUTH_ERROR', req.ip, errorData);
  }

  // Log validation errors
  if (error.statusCode === 400) {
    logger.warn('Validation Error', errorData);
  }

  // Log server errors
  if (error.statusCode >= 500) {
    logger.error('Server Error', errorData);
  }

  // Log operational errors
  if (error.isOperational) {
    logger.warn('Operational Error', errorData);
  }
};

// ========================================
// MAIN ERROR HANDLER MIDDLEWARE
// ========================================
const errorHandler = (error, req, res, next) => {
  // Set default values
  error.statusCode = error.statusCode || 500;
  error.message = error.message || 'Internal Server Error';

  // Log the error
  logError(error, req);

  // Format error response
  const errorResponse = formatErrorResponse(error, req);

  // Send error response
  res.status(error.statusCode).json(errorResponse);
};

// ========================================
// ASYNC ERROR HANDLER WRAPPER
// ========================================
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ========================================
// VALIDATION ERROR HANDLER
// ========================================
const handleValidationError = (error) => {
  const details = [];
  
  if (error.details) {
    error.details.forEach((detail) => {
      details.push({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.value,
      });
    });
  }

  return new ValidationError('Validation failed', details);
};

// ========================================
// DATABASE ERROR HANDLER
// ========================================
const handleDatabaseError = (error) => {
  // PostgreSQL unique constraint violation
  if (error.code === '23505') {
    const field = error.detail.match(/Key \((.+)\)=/)?.[1] || 'field';
    return new ConflictError(`${field} already exists`);
  }

  // PostgreSQL foreign key violation
  if (error.code === '23503') {
    return new ValidationError('Referenced resource does not exist');
  }

  // PostgreSQL check constraint violation
  if (error.code === '23514') {
    return new ValidationError('Data validation failed');
  }

  // Default database error
  return new AppError('Database operation failed', 500, 'DATABASE_ERROR');
};

// ========================================
// JWT ERROR HANDLER
// ========================================
const handleJWTError = (error) => {
  if (error.name === 'JsonWebTokenError') {
    return new AuthenticationError('Invalid token');
  }
  
  if (error.name === 'TokenExpiredError') {
    return new AuthenticationError('Token expired');
  }
  
  return new AuthenticationError('Token verification failed');
};

// ========================================
// ENHANCED ERROR HANDLER WITH SPECIFIC CASES
// ========================================
const enhancedErrorHandler = (error, req, res, next) => {
  let processedError = error;

  // Handle specific error types
  if (error.name === 'ValidationError') {
    processedError = handleValidationError(error);
  } else if (error.code && error.code.startsWith('23')) {
    processedError = handleDatabaseError(error);
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    processedError = handleJWTError(error);
  } else if (error.name === 'CastError') {
    processedError = new ValidationError('Invalid ID format');
  } else if (error.name === 'MongoError' && error.code === 11000) {
    processedError = new ConflictError('Duplicate field value');
  }

  // Call the main error handler
  errorHandler(processedError, req, res, next);
};

// ========================================
// NOT FOUND HANDLER
// ========================================
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError('API endpoint');
  next(error);
};

// ========================================
// EXPORT ALL ERROR HANDLERS AND UTILITIES
// ========================================
module.exports = {
  errorHandler: enhancedErrorHandler,
  notFoundHandler,
  asyncHandler,
  
  // Error Classes
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  
  // Utility Functions
  formatErrorResponse,
  logError,
  handleValidationError,
  handleDatabaseError,
  handleJWTError,
}; 