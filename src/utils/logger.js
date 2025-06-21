/**
 * 📝 Logger Utility - Winston Configuration
 * Advanced logging system for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Centralized logging with multiple transports and formats
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

// ========================================
// LOG DIRECTORY CREATION
// ========================================
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// ========================================
// CUSTOM LOG FORMATS
// ========================================
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    if (stack) {
      log += `\n${stack}`;
    }
    
    return log;
  })
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    return log;
  })
);

// ========================================
// LOG LEVELS CONFIGURATION
// ========================================
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(logColors);

// ========================================
// TRANSPORTS CONFIGURATION
// ========================================
const transports = [];

// Console Transport (Development)
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'debug',
      format: consoleFormat,
      handleExceptions: true,
      handleRejections: true,
    })
  );
}

// File Transport - Error Logs
transports.push(
  new winston.transports.File({
    filename: path.join(logDir, 'error.log'),
    level: 'error',
    format: customFormat,
    maxsize: parseInt(process.env.LOG_MAX_SIZE) || 20 * 1024 * 1024, // 20MB
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 14, // 14 days
    handleExceptions: true,
    handleRejections: true,
  })
);

// File Transport - Combined Logs
transports.push(
  new winston.transports.File({
    filename: path.join(logDir, 'combined.log'),
    format: customFormat,
    maxsize: parseInt(process.env.LOG_MAX_SIZE) || 20 * 1024 * 1024, // 20MB
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 14, // 14 days
  })
);

// File Transport - HTTP Logs
transports.push(
  new winston.transports.File({
    filename: path.join(logDir, 'http.log'),
    level: 'http',
    format: customFormat,
    maxsize: parseInt(process.env.LOG_MAX_SIZE) || 20 * 1024 * 1024, // 20MB
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 14, // 14 days
  })
);

// ========================================
// LOGGER INSTANCE CREATION
// ========================================
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: customFormat,
  transports: transports,
  exitOnError: false,
});

// ========================================
// CUSTOM LOGGER METHODS
// ========================================
class CustomLogger {
  /**
   * Log API request information
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {number} responseTime - Response time in milliseconds
   */
  static logApiRequest(req, res, responseTime) {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id || 'anonymous',
    };

    if (res.statusCode >= 400) {
      logger.warn('API Request', logData);
    } else {
      logger.http('API Request', logData);
    }
  }

  /**
   * Log database operations
   * @param {string} operation - Database operation type
   * @param {string} table - Table name
   * @param {Object} data - Operation data
   * @param {number} duration - Operation duration in milliseconds
   */
  static logDatabaseOperation(operation, table, data = {}, duration = 0) {
    logger.info('Database Operation', {
      operation,
      table,
      duration: `${duration}ms`,
      data: Object.keys(data).length > 0 ? data : undefined,
    });
  }

  /**
   * Log authentication events
   * @param {string} event - Authentication event type
   * @param {string} userId - User ID
   * @param {string} ip - IP address
   * @param {Object} details - Additional details
   */
  static logAuthEvent(event, userId, ip, details = {}) {
    logger.info('Authentication Event', {
      event,
      userId,
      ip,
      ...details,
    });
  }

  /**
   * Log security events
   * @param {string} event - Security event type
   * @param {string} ip - IP address
   * @param {Object} details - Event details
   */
  static logSecurityEvent(event, ip, details = {}) {
    logger.warn('Security Event', {
      event,
      ip,
      ...details,
    });
  }

  /**
   * Log performance metrics
   * @param {string} metric - Metric name
   * @param {number} value - Metric value
   * @param {string} unit - Unit of measurement
   * @param {Object} context - Additional context
   */
  static logPerformance(metric, value, unit = 'ms', context = {}) {
    logger.info('Performance Metric', {
      metric,
      value: `${value}${unit}`,
      ...context,
    });
  }

  /**
   * Log business events
   * @param {string} event - Business event type
   * @param {Object} data - Event data
   * @param {string} userId - User ID (optional)
   */
  static logBusinessEvent(event, data = {}, userId = null) {
    logger.info('Business Event', {
      event,
      userId,
      ...data,
    });
  }
}

// ========================================
// EXPORT LOGGER INSTANCE AND CUSTOM METHODS
// ========================================
module.exports = {
  logger,
  CustomLogger,
  
  // Convenience methods
  info: (message, meta = {}) => logger.info(message, meta),
  warn: (message, meta = {}) => logger.warn(message, meta),
  error: (message, meta = {}) => logger.error(message, meta),
  debug: (message, meta = {}) => logger.debug(message, meta),
  http: (message, meta = {}) => logger.http(message, meta),
}; 