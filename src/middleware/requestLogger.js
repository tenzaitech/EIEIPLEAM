/**
 * 📊 Request Logger Middleware
 * Request tracking and performance monitoring for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Request logging with performance metrics and analytics
 */

const { v4: uuidv4 } = require('uuid');
const { CustomLogger } = require('../utils/logger');

// ========================================
// REQUEST ID GENERATOR
// ========================================
const generateRequestId = () => {
  return uuidv4().replace(/-/g, '').substring(0, 16);
};

// ========================================
// REQUEST DATA EXTRACTOR
// ========================================
const extractRequestData = (req) => {
  return {
    id: req.id,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    referer: req.get('Referer'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    body: req.method !== 'GET' && Object.keys(req.body).length > 0 ? req.body : undefined,
    params: Object.keys(req.params).length > 0 ? req.params : undefined,
    userId: req.user?.id || 'anonymous',
    userRole: req.user?.role || 'guest',
  };
};

// ========================================
// RESPONSE DATA EXTRACTOR
// ========================================
const extractResponseData = (res, responseTime) => {
  return {
    statusCode: res.statusCode,
    contentLength: res.get('Content-Length'),
    contentType: res.get('Content-Type'),
    responseTime: `${responseTime}ms`,
    cacheControl: res.get('Cache-Control'),
    etag: res.get('ETag'),
  };
};

// ========================================
// PERFORMANCE CLASSIFICATION
// ========================================
const classifyPerformance = (responseTime) => {
  if (responseTime < 100) return 'excellent';
  if (responseTime < 300) return 'good';
  if (responseTime < 1000) return 'fair';
  return 'poor';
};

// ========================================
// REQUEST FILTERING
// ========================================
const shouldSkipLogging = (req) => {
  const skipPaths = [
    '/health',
    '/favicon.ico',
    '/robots.txt',
    '/.well-known/',
  ];

  const skipMethods = ['OPTIONS'];

  // Skip health checks and static files
  if (skipPaths.some(path => req.originalUrl.startsWith(path))) {
    return true;
  }

  // Skip OPTIONS requests
  if (skipMethods.includes(req.method)) {
    return true;
  }

  // Skip if explicitly disabled
  if (req.headers['x-skip-logging'] === 'true') {
    return true;
  }

  return false;
};

// ========================================
// MAIN REQUEST LOGGER MIDDLEWARE
// ========================================
const requestLogger = (req, res, next) => {
  // Generate unique request ID
  req.id = generateRequestId();

  // Add request ID to response headers
  res.setHeader('X-Request-ID', req.id);

  // Skip logging for certain requests
  if (shouldSkipLogging(req)) {
    return next();
  }

  // Record start time
  const startTime = Date.now();

  // Extract initial request data
  const requestData = extractRequestData(req);

  // Log incoming request
  CustomLogger.logApiRequest(req, res, 0);

  // Override res.end to capture response data
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Extract response data
    const responseData = extractResponseData(res, responseTime);

    // Combine request and response data
    const logData = {
      ...requestData,
      ...responseData,
      performance: classifyPerformance(responseTime),
      timestamp: new Date().toISOString(),
    };

    // Log the complete request-response cycle
    if (res.statusCode >= 400) {
      CustomLogger.logApiRequest(req, res, responseTime);
    } else {
      CustomLogger.logApiRequest(req, res, responseTime);
    }

    // Log performance metrics for slow requests
    if (responseTime > 1000) {
      CustomLogger.logPerformance('slow_request', responseTime, 'ms', {
        url: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
      });
    }

    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// ========================================
// DETAILED REQUEST LOGGER (FOR DEBUGGING)
// ========================================
const detailedRequestLogger = (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return next();
  }

  console.log('\n=== REQUEST DETAILS ===');
  console.log(`Request ID: ${req.id}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`IP: ${req.ip}`);
  console.log(`User Agent: ${req.get('User-Agent')}`);
  console.log(`Content Type: ${req.get('Content-Type')}`);
  console.log(`Content Length: ${req.get('Content-Length')}`);
  
  if (Object.keys(req.query).length > 0) {
    console.log('Query Parameters:', req.query);
  }
  
  if (Object.keys(req.body).length > 0) {
    console.log('Request Body:', req.body);
  }
  
  if (Object.keys(req.params).length > 0) {
    console.log('URL Parameters:', req.params);
  }
  
  console.log('========================\n');

  next();
};

// ========================================
// REQUEST ID MIDDLEWARE (STANDALONE)
// ========================================
const requestIdMiddleware = (req, res, next) => {
  req.id = req.get('X-Request-ID') || generateRequestId();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// ========================================
// RESPONSE TIME MIDDLEWARE (STANDALONE)
// ========================================
const responseTimeMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    // Log performance metrics
    CustomLogger.logPerformance('response_time', duration, 'ms', {
      url: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
    });
  });
  
  next();
};

// ========================================
// REQUEST SIZE LIMITER
// ========================================
const requestSizeLimiter = (req, res, next) => {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB
  const contentLength = parseInt(req.get('Content-Length') || '0');
  
  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request entity too large',
        details: [`Maximum allowed size: ${maxSize / (1024 * 1024)}MB`],
      },
      timestamp: new Date().toISOString(),
    });
  }
  
  next();
};

// ========================================
// REQUEST VALIDATION LOGGER
// ========================================
const requestValidationLogger = (req, res, next) => {
  // Log validation errors if any
  if (req.validationErrors && req.validationErrors.length > 0) {
    CustomLogger.logSecurityEvent('VALIDATION_ERROR', req.ip, {
      errors: req.validationErrors,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
    });
  }
  
  next();
};

// ========================================
// EXPORT ALL MIDDLEWARE FUNCTIONS
// ========================================
module.exports = {
  requestLogger,
  detailedRequestLogger,
  requestIdMiddleware,
  responseTimeMiddleware,
  requestSizeLimiter,
  requestValidationLogger,
  
  // Utility functions
  generateRequestId,
  extractRequestData,
  extractResponseData,
  classifyPerformance,
  shouldSkipLogging,
}; 