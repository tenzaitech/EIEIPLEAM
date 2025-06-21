/**
 * ✅ Validation Middleware
 * Input validation and sanitization middleware
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Middleware for request validation and sanitization
 */

const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', {
      path: req.path,
      method: req.method,
      errors: errors.array(),
      ip: req.ip
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }

  next();
};

/**
 * Middleware to validate UUID format
 */
const validateUUID = (paramName) => {
  return (req, res, next) => {
    const value = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!uuidRegex.test(value)) {
      logger.warn('Invalid UUID format', {
        paramName,
        value,
        path: req.path,
        ip: req.ip
      });

      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`,
        code: 'INVALID_UUID',
        field: paramName,
        value: value
      });
    }

    next();
  };
};

/**
 * Middleware to validate pagination parameters
 */
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const maxLimit = 100;

  if (page < 1) {
    return res.status(400).json({
      success: false,
      message: 'Page number must be greater than 0',
      code: 'INVALID_PAGE'
    });
  }

  if (limit < 1 || limit > maxLimit) {
    return res.status(400).json({
      success: false,
      message: `Limit must be between 1 and ${maxLimit}`,
      code: 'INVALID_LIMIT'
    });
  }

  req.pagination = { page, limit, offset: (page - 1) * limit };
  next();
};

/**
 * Middleware to validate date range
 */
const validateDateRange = (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format',
        code: 'INVALID_DATE_FORMAT'
      });
    }

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Start date must be before end date',
        code: 'INVALID_DATE_RANGE'
      });
    }
  }

  next();
};

/**
 * Middleware to sanitize input
 */
const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  next();
};

/**
 * Validate ObjectId Format
 * Validates MongoDB ObjectId format
 */
const validateObjectId = (req, res, next) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  
  // Check if any parameter is supposed to be an ObjectId
  const params = req.params;
  Object.keys(params).forEach(key => {
    if (key.toLowerCase().includes('id') && params[key] !== 'undefined') {
      if (!objectIdPattern.test(params[key])) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_ID_FORMAT',
            message: `Invalid ${key} format`,
            details: [`${key} must be a valid 24-character hexadecimal string`]
          },
          timestamp: new Date().toISOString()
        });
      }
    }
  });

  next();
};

/**
 * Validate File Upload
 * Validates file upload requests
 */
const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'NO_FILE_UPLOADED',
        message: 'No file uploaded',
        details: ['Please select a file to upload']
      },
      timestamp: new Date().toISOString()
    });
  }

  // Check file size
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
  const file = req.file || (req.files && req.files[0]);
  
  if (file && file.size > maxSize) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: 'File size exceeds limit',
        details: [`File size must be less than ${maxSize / (1024 * 1024)}MB`]
      },
      timestamp: new Date().toISOString()
    });
  }

  // Check file type
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf'
  ];

  if (file && !allowedTypes.includes(file.mimetype)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: 'Invalid file type',
        details: [`Allowed file types: ${allowedTypes.join(', ')}`]
      },
      timestamp: new Date().toISOString()
    });
  }

  next();
};

module.exports = {
  handleValidationErrors,
  validateUUID,
  validatePagination,
  validateDateRange,
  sanitizeInput,
  validateObjectId,
  validateFileUpload
}; 