/**
 * 🔐 Auth Middleware
 * JWT authentication and authorization middleware
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Middleware for JWT token verification and role-based access control
 */

const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate JWT token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn('Authentication failed: No token provided', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    return res.status(401).json({
      success: false,
      message: 'Access token required',
      code: 'TOKEN_REQUIRED'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.info('Token authenticated successfully', {
      userId: decoded.userId,
      email: decoded.email,
      path: req.path
    });
    next();
  } catch (error) {
    logger.error('Token verification failed', {
      error: error.message,
      ip: req.ip,
      path: req.path
    });
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token',
      code: 'TOKEN_INVALID'
    });
  }
};

/**
 * Middleware to check user roles
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Role check failed: No user in request', {
        path: req.path,
        ip: req.ip
      });
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      logger.warn('Role check failed: Insufficient permissions', {
        userId: req.user.userId,
        userRole: userRole,
        requiredRoles: allowedRoles,
        path: req.path
      });
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles,
        userRole: userRole
      });
    }

    logger.info('Role check passed', {
      userId: req.user.userId,
      userRole: userRole,
      path: req.path
    });
    next();
  };
};

/**
 * Middleware to check if user is admin
 */
const requireAdmin = (req, res, next) => {
  return requireRole(['admin'])(req, res, next);
};

/**
 * Middleware to check if user is manager or admin
 */
const requireManager = (req, res, next) => {
  return requireRole(['admin', 'manager'])(req, res, next);
};

/**
 * Optional Authentication
 * Middleware that adds user info if token is provided, but doesn't require it
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, decoded) => {
        if (!err) {
          req.user = decoded;
          logger.info('Optional authentication successful', {
            userId: decoded.userId,
            email: decoded.email
          });
        }
        next();
      });
    } else {
      next();
    }

  } catch (error) {
    logger.error('Optional authentication error:', error);
    next(); // Continue without authentication
  }
};

/**
 * Rate Limiting for Authentication
 * Limits login attempts to prevent brute force attacks
 */
const authRateLimit = (req, res, next) => {
  // This would typically use Redis or a similar store
  // For now, we'll implement a simple in-memory rate limiting
  
  const clientIP = req.ip;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;

  // In production, use Redis or database for rate limiting
  // This is a simplified version
  if (!req.authAttempts) {
    req.authAttempts = new Map();
  }

  const attempts = req.authAttempts.get(clientIP) || [];
  const recentAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

  if (recentAttempts.length >= maxAttempts) {
    logger.warn('Rate limit exceeded for authentication', {
      ip: clientIP,
      attempts: recentAttempts.length
    });

    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many authentication attempts',
        details: ['Please try again later']
      },
      timestamp: new Date().toISOString()
    });
  }

  // Add current attempt
  recentAttempts.push(now);
  req.authAttempts.set(clientIP, recentAttempts);

  next();
};

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireManager,
  optionalAuth,
  authRateLimit
}; 