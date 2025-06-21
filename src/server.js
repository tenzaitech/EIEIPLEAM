/**
 * 🚀 TENZAI Express.js Backend API v1.0
 * Main Server File - Clean Code Architecture
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Main server entry point with all middleware and configurations
 */

// ========================================
// CORE IMPORTS
// ========================================
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
require('dotenv').config();

// ========================================
// CUSTOM IMPORTS
// ========================================
const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { notFoundHandler } = require('./middleware/notFoundHandler');
const { requestLogger } = require('./middleware/requestLogger');
const { securityMiddleware } = require('./middleware/securityMiddleware');

// ========================================
// CONFIGURATION
// ========================================
const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiVersion: process.env.API_VERSION || 'v1',
  apiPrefix: process.env.API_PREFIX || '/api/v1'
};

// ========================================
// EXPRESS APP INITIALIZATION
// ========================================
const app = express();

// ========================================
// SECURITY MIDDLEWARE (FIRST PRIORITY)
// ========================================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: process.env.CORS_CREDENTIALS === 'true',
  methods: process.env.CORS_METHODS?.split(',') || ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ========================================
// RATE LIMITING & THROTTLING
// ========================================
if (process.env.ENABLE_RATE_LIMITING === 'true') {
  // Rate Limiting
  const rateLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests from this IP, please try again later.',
        details: []
      },
      timestamp: new Date().toISOString()
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESSFUL_REQUESTS === 'true'
  });

  // Speed Limiting
  const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 50, // allow 50 requests per 15 minutes, then...
    delayMs: () => 500 // begin adding 500ms of delay per request above 50
  });

  app.use(rateLimiter);
  app.use(speedLimiter);
}

// ========================================
// BODY PARSING MIDDLEWARE
// ========================================
app.use(express.json({ 
  limit: process.env.MAX_FILE_SIZE || '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: process.env.MAX_FILE_SIZE || '10mb' 
}));

// ========================================
// COMPRESSION MIDDLEWARE
// ========================================
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// ========================================
// LOGGING MIDDLEWARE
// ========================================
// HTTP Request Logging
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Custom Request Logger
app.use(requestLogger);

// ========================================
// CUSTOM SECURITY MIDDLEWARE
// ========================================
app.use(securityMiddleware);

// ========================================
// HEALTH CHECK ENDPOINT
// ========================================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.nodeEnv,
      version: '1.0.0',
      memory: process.memoryUsage(),
      pid: process.pid
    },
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// ========================================
// API ROUTES
// ========================================
// Import and use route modules
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const materialRoutes = require('./routes/materialRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const mcpRoutes = require('./routes/mcpRoutes'); // 🤖 MCP Routes

// Apply routes with API prefix
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/users`, userRoutes);
app.use(`${config.apiPrefix}/suppliers`, supplierRoutes);
app.use(`${config.apiPrefix}/materials`, materialRoutes);
app.use(`${config.apiPrefix}/purchase-orders`, purchaseOrderRoutes);
app.use('/api/mcp', mcpRoutes); // 🤖 MCP Routes (ไม่ใช้ prefix)

// ========================================
// API DOCUMENTATION ROUTE
// ========================================
app.get(`${config.apiPrefix}/docs`, (req, res) => {
  res.json({
    success: true,
    data: {
      title: 'TENZAI Express.js Backend API v1.0',
      version: '1.0.0',
      description: 'Complete procurement management solution with MCP Integration',
      endpoints: {
        auth: `${config.apiPrefix}/auth`,
        users: `${config.apiPrefix}/users`,
        suppliers: `${config.apiPrefix}/suppliers`,
        materials: `${config.apiPrefix}/materials`,
        purchaseOrders: `${config.apiPrefix}/purchase-orders`,
        mcp: '/api/mcp' // 🤖 MCP Integration
      },
      mcpFeatures: {
        chat: '/api/mcp/chat',
        tools: '/api/mcp/tools',
        context: '/api/mcp/context',
        health: '/api/mcp/health'
      },
      documentation: 'https://docs.tenzaitech.com/api'
    },
    message: 'API Documentation',
    timestamp: new Date().toISOString()
  });
});

// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================
// 404 Not Found Handler
app.use(notFoundHandler);

// Global Error Handler (MUST BE LAST)
app.use(errorHandler);

// ========================================
// GRACEFUL SHUTDOWN HANDLING
// ========================================
const gracefulShutdown = (signal) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  
  server.close(() => {
    logger.info('HTTP server closed.');
    
    // Close database connections
    // db.close();
    
    // Close Redis connections
    // redis.quit();
    
    process.exit(0);
  });
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// ========================================
// SERVER STARTUP
// ========================================
const server = app.listen(config.port, () => {
  logger.info(`🚀 TENZAI Express.js Backend API v1.0 is running!`);
  logger.info(`📍 Environment: ${config.nodeEnv}`);
  logger.info(`🌐 Server: http://localhost:${config.port}`);
  logger.info(`📚 API Documentation: http://localhost:${config.port}${config.apiPrefix}/docs`);
  logger.info(`❤️  Health Check: http://localhost:${config.port}/health`);
  logger.info(`⏰ Started at: ${new Date().toISOString()}`);
  logger.info(`🆔 Process ID: ${process.pid}`);
});

// ========================================
// EXPORT FOR TESTING
// ========================================
module.exports = { app, server }; 