/**
 * 🚀 Main Routes Index
 * Central route configuration for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Main router that combines all route modules
 */

const express = require('express');
const { logger } = require('../utils/logger');

// Import route modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const supplierRoutes = require('./supplierRoutes');
const materialRoutes = require('./materialRoutes');
const purchaseOrderRoutes = require('./purchaseOrderRoutes');
const mcpRoutes = require('./mcpRoutes'); // 🤖 MCP Routes

const router = express.Router();

// ========================================
// ROUTE CONFIGURATION
// ========================================

/**
 * API Health Check
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TENZAI Express.js Backend is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * API Information
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TENZAI Purchasing System API',
    version: '1.0.0',
    description: 'Backend API for TENZAI Purchasing System with MCP Integration',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      suppliers: '/api/suppliers',
      materials: '/api/materials',
      purchaseOrders: '/api/purchase-orders',
      mcp: '/api/mcp' // 🤖 MCP Integration
    },
    features: [
      'User Authentication & Authorization',
      'Supplier Management',
      'Material Management',
      'Purchase Order Management',
      'AI Integration (MCP)',
      'Context Management',
      'Tool Execution',
      'Data Analysis & Reporting'
    ]
  });
});

// ========================================
// ROUTE MOUNTING
// ========================================

// Mount route modules with API prefix
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/suppliers', supplierRoutes);
router.use('/api/materials', materialRoutes);
router.use('/api/purchase-orders', purchaseOrderRoutes);
router.use('/api/mcp', mcpRoutes); // 🤖 MCP Routes

// ========================================
// ROUTE LOGGING MIDDLEWARE
// ========================================

/**
 * Log all API requests
 */
router.use((req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info('API Request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    
    // Log response
    logger.info('API Response', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      success: data.success,
      timestamp: new Date().toISOString()
    });

    return originalJson.call(this, data);
  };

  next();
});

// ========================================
// ERROR HANDLING
// ========================================

/**
 * Handle 404 - Route not found
 */
router.use('*', (req, res) => {
  logger.warn('Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });

  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/users',
      'GET /api/suppliers',
      'GET /api/materials',
      'GET /api/purchase-orders',
      'GET /api/mcp/status',
      'POST /api/mcp/chat',
      'GET /api/mcp/tools',
      'POST /api/mcp/tools/execute'
    ]
  });
});

/**
 * Global error handler
 */
router.use((error, req, res, next) => {
  logger.error('Global error handler', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });

  res.status(error.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = router; 