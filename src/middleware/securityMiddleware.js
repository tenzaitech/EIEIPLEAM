/**
 * 🛡️ Security Middleware
 * Comprehensive security measures for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Security middleware with multiple protection layers
 */

const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const { CustomLogger } = require('../utils/logger');

// ========================================
// SECURITY CONFIGURATION
// ========================================
const securityConfig = {
  // Content Security Policy
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.tenzaitech.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      manifestSrc: ["'self'"],
    },
  },

  // Allowed origins for CORS
  allowedOrigins: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://tenzaitech.com',
    'https://app.tenzaitech.com'
  ],

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === 'true',
  },

  // File upload restrictions
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain'
    ],
  },
};

// ========================================
// IP ADDRESS VALIDATION
// ========================================
const validateIpAddress = (ip) => {
  // Basic IP validation
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(ip);
};

// ========================================
// SUSPICIOUS ACTIVITY DETECTION
// ========================================
const detectSuspiciousActivity = (req) => {
  const suspiciousPatterns = [
    // SQL Injection patterns
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute|script)\b)/i,
    // XSS patterns
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    // Path traversal
    /\.\.\//,
    // Command injection
    /[;&|`$()]/,
  ];

  const userInput = JSON.stringify({
    url: req.originalUrl,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userInput)) {
      return true;
    }
  }

  return false;
};

// ========================================
// REQUEST SANITIZATION
// ========================================
const sanitizeRequest = (req) => {
  // Sanitize body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  // Sanitize URL parameters
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
};

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Remove potentially dangerous characters
      sanitized[key] = value
        .replace(/[<>]/g, '') // Remove < and >
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+=/gi, '') // Remove event handlers
        .trim();
    } else {
      sanitized[key] = sanitizeObject(value);
    }
  }

  return sanitized;
};

// ========================================
// MAIN SECURITY MIDDLEWARE
// ========================================
const securityMiddleware = (req, res, next) => {
  // Add security headers
  addSecurityHeaders(res);

  // Validate IP address
  if (!validateIpAddress(req.ip)) {
    CustomLogger.logSecurityEvent('INVALID_IP', req.ip, {
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
    });
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_IP_ADDRESS',
        message: 'Invalid IP address',
        details: [],
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Detect suspicious activity
  if (detectSuspiciousActivity(req)) {
    CustomLogger.logSecurityEvent('SUSPICIOUS_ACTIVITY', req.ip, {
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      body: req.body,
      query: req.query,
    });
    return res.status(403).json({
      success: false,
      error: {
        code: 'SUSPICIOUS_ACTIVITY_DETECTED',
        message: 'Suspicious activity detected',
        details: [],
      },
      timestamp: new Date().toISOString(),
    });
  }

  // Sanitize request data
  sanitizeRequest(req);

  next();
};

// ========================================
// SECURITY HEADERS MIDDLEWARE
// ========================================
const addSecurityHeaders = (res) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions policy
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Strict transport security (HTTPS only)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
};

// ========================================
// CORS SECURITY MIDDLEWARE
// ========================================
const corsSecurityMiddleware = (req, res, next) => {
  const origin = req.headers.origin;
  
  if (origin && !securityConfig.allowedOrigins.includes(origin)) {
    CustomLogger.logSecurityEvent('CORS_VIOLATION', req.ip, {
      origin,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
    });
    return res.status(403).json({
      success: false,
      error: {
        code: 'CORS_VIOLATION',
        message: 'Cross-origin request not allowed',
        details: [],
      },
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

// ========================================
// FILE UPLOAD SECURITY MIDDLEWARE
// ========================================
const fileUploadSecurityMiddleware = (req, res, next) => {
  if (!req.files && !req.file) {
    return next();
  }

  const files = req.files || [req.file];
  
  for (const file of files) {
    // Check file size
    if (file.size > securityConfig.fileUpload.maxSize) {
      CustomLogger.logSecurityEvent('FILE_SIZE_VIOLATION', req.ip, {
        fileName: file.originalname,
        fileSize: file.size,
        maxSize: securityConfig.fileUpload.maxSize,
      });
      return res.status(413).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'File size exceeds maximum allowed size',
          details: [`Maximum size: ${securityConfig.fileUpload.maxSize / (1024 * 1024)}MB`],
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Check file type
    if (!securityConfig.fileUpload.allowedTypes.includes(file.mimetype)) {
      CustomLogger.logSecurityEvent('FILE_TYPE_VIOLATION', req.ip, {
        fileName: file.originalname,
        fileType: file.mimetype,
        allowedTypes: securityConfig.fileUpload.allowedTypes,
      });
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: 'File type not allowed',
          details: [`Allowed types: ${securityConfig.fileUpload.allowedTypes.join(', ')}`],
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Check for malicious file extensions
    const maliciousExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (maliciousExtensions.includes(fileExtension)) {
      CustomLogger.logSecurityEvent('MALICIOUS_FILE_ATTEMPT', req.ip, {
        fileName: file.originalname,
        fileExtension,
        userAgent: req.get('User-Agent'),
      });
      return res.status(400).json({
        success: false,
        error: {
          code: 'MALICIOUS_FILE_DETECTED',
          message: 'Malicious file type detected',
          details: [],
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  next();
};

// ========================================
// REQUEST SIZE LIMITER MIDDLEWARE
// ========================================
const requestSizeLimiterMiddleware = (req, res, next) => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  const maxSize = securityConfig.fileUpload.maxSize;

  if (contentLength > maxSize) {
    CustomLogger.logSecurityEvent('REQUEST_SIZE_VIOLATION', req.ip, {
      contentLength,
      maxSize,
      url: req.originalUrl,
    });
    return res.status(413).json({
      success: false,
      error: {
        code: 'REQUEST_TOO_LARGE',
        message: 'Request entity too large',
        details: [`Maximum size: ${maxSize / (1024 * 1024)}MB`],
      },
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

// ========================================
// PARAMETER POLLUTION PROTECTION
// ========================================
const parameterPollutionProtection = hpp({
  whitelist: ['filter', 'sort', 'page', 'limit'], // Allow these parameters to be arrays
});

// ========================================
// NO-SQL INJECTION PROTECTION
// ========================================
const noSqlInjectionProtection = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    CustomLogger.logSecurityEvent('NOSQL_INJECTION_ATTEMPT', req.ip, {
      key,
      value: req.body[key],
      url: req.originalUrl,
    });
  },
});

// ========================================
// EXPORT ALL SECURITY MIDDLEWARE
// ========================================
module.exports = {
  securityMiddleware,
  corsSecurityMiddleware,
  fileUploadSecurityMiddleware,
  requestSizeLimiterMiddleware,
  parameterPollutionProtection,
  noSqlInjectionProtection,
  
  // Utility functions
  validateIpAddress,
  detectSuspiciousActivity,
  sanitizeRequest,
  addSecurityHeaders,
  
  // Configuration
  securityConfig,
}; 