/**
 * 🤖 MCP (Model Context Protocol) Routes
 * AI Integration and Context Management API Routes for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description API routes for MCP functionality including AI chat, tool execution, and context management
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { mcpService } = require('../services/mcpService');
const { mcpConfig, mcpUtils } = require('../config/mcpConfig');
const { logger } = require('../utils/logger');

const router = express.Router();

// ========================================
// MIDDLEWARE
// ========================================

/**
 * Validate MCP API key if required
 */
const validateMCPApiKey = (req, res, next) => {
  if (!mcpConfig.security.apiKeyRequired) {
    return next();
  }

  const apiKey = req.headers['x-mcp-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'MCP API key required',
      code: 'MCP_API_KEY_MISSING'
    });
  }

  // In production, validate against stored API keys
  if (apiKey !== process.env.MCP_API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Invalid MCP API key',
      code: 'MCP_API_KEY_INVALID'
    });
  }

  next();
};

/**
 * Rate limiting middleware for MCP endpoints
 */
const mcpRateLimit = (req, res, next) => {
  if (!mcpConfig.security.rateLimit.enabled) {
    return next();
  }

  // Simple in-memory rate limiting - in production, use Redis
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = mcpConfig.security.rateLimit.windowMs;
  const max = mcpConfig.security.rateLimit.max;

  // Initialize rate limit tracking
  if (!req.app.locals.mcpRateLimit) {
    req.app.locals.mcpRateLimit = new Map();
  }

  const rateLimitMap = req.app.locals.mcpRateLimit;
  const key = `mcp:${clientIp}`;
  const current = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

  // Reset if window has passed
  if (now > current.resetTime) {
    current.count = 0;
    current.resetTime = now + windowMs;
  }

  // Check if limit exceeded
  if (current.count >= max) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      code: 'MCP_RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    });
  }

  // Increment counter
  current.count++;
  rateLimitMap.set(key, current);

  // Add headers
  res.set({
    'X-RateLimit-Limit': max,
    'X-RateLimit-Remaining': max - current.count,
    'X-RateLimit-Reset': current.resetTime
  });

  next();
};

// ========================================
// VALIDATION SCHEMAS
// ========================================

const chatValidation = [
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 10000 })
    .withMessage('Message must be between 1 and 10000 characters'),
  body('sessionId')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Session ID must be between 1 and 100 characters'),
  body('options')
    .optional()
    .isObject()
    .withMessage('Options must be an object'),
  body('options.executeTools')
    .optional()
    .isBoolean()
    .withMessage('executeTools must be a boolean'),
  body('options.maxTokens')
    .optional()
    .isInt({ min: 1, max: 8000 })
    .withMessage('maxTokens must be between 1 and 8000'),
  body('options.temperature')
    .optional()
    .isFloat({ min: 0, max: 2 })
    .withMessage('temperature must be between 0 and 2')
];

const toolExecutionValidation = [
  body('toolName')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Tool name must be between 1 and 100 characters'),
  body('parameters')
    .isObject()
    .withMessage('Parameters must be an object'),
  body('sessionId')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Session ID must be between 1 and 100 characters')
];

const contextValidation = [
  body('sessionId')
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Session ID must be between 1 and 100 characters'),
  body('data')
    .optional()
    .isObject()
    .withMessage('Data must be an object')
];

// ========================================
// ROUTES
// ========================================

/**
 * @route   GET /api/mcp/status
 * @desc    Get MCP service status and configuration
 * @access  Public
 */
router.get('/status', validateMCPApiKey, async (req, res) => {
  try {
    const status = mcpService.getStatus();
    const serverInfo = mcpUtils.getServerInfo();

    res.json({
      success: true,
      data: {
        status,
        server: serverInfo,
        config: {
          enabled: mcpConfig.server.enabled,
          ai: {
            provider: mcpConfig.ai.provider,
            model: mcpConfig.ai.model
          },
          tools: {
            enabled: mcpConfig.tools.enableTools,
            count: Object.keys(mcpConfig.tools.availableTools).length
          },
          context: {
            enabled: mcpConfig.context.enableMemory,
            maxSize: mcpConfig.context.maxContextSize
          }
        }
      }
    });
  } catch (error) {
    logger.error('MCP status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get MCP status',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/mcp/chat
 * @desc    Process AI chat request with context and tools
 * @access  Private
 */
router.post('/chat', 
  validateMCPApiKey, 
  mcpRateLimit, 
  chatValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { message, sessionId, options = {} } = req.body;
      
      // Generate session ID if not provided
      const finalSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Process request
      const result = await mcpService.processRequest(finalSessionId, message, options);

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error,
          sessionId: finalSessionId
        });
      }

      // Log if enabled
      if (mcpConfig.logging.enableAILogging) {
        logger.info('MCP Chat Request', {
          sessionId: finalSessionId,
          messageLength: message.length,
          responseLength: result.response.length,
          duration: result.metadata.duration,
          provider: result.metadata.provider
        });
      }

      res.json({
        success: true,
        data: {
          response: result.response,
          sessionId: finalSessionId,
          toolResults: result.toolResults,
          context: result.context,
          metadata: result.metadata
        }
      });

    } catch (error) {
      logger.error('MCP chat request failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process chat request',
        details: error.message
      });
    }
  }
);

/**
 * @route   POST /api/mcp/tools/execute
 * @desc    Execute a specific tool
 * @access  Private
 */
router.post('/tools/execute',
  validateMCPApiKey,
  mcpRateLimit,
  toolExecutionValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { toolName, parameters, sessionId } = req.body;

      // Check if tools are enabled
      if (!mcpConfig.tools.enableTools) {
        return res.status(400).json({
          success: false,
          error: 'Tools are not enabled',
          code: 'TOOLS_DISABLED'
        });
      }

      // Get context if session ID provided
      let context = {};
      if (sessionId) {
        context = mcpService.contextManager?.getContext(sessionId) || {};
      }

      // Execute tool
      const result = await mcpService.toolEngine.executeTool(toolName, parameters, context);

      res.json({
        success: true,
        data: {
          toolName,
          result: result.result,
          success: result.success,
          metadata: result.metadata
        }
      });

    } catch (error) {
      logger.error('MCP tool execution failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to execute tool',
        details: error.message
      });
    }
  }
);

/**
 * @route   GET /api/mcp/tools
 * @desc    Get available tools
 * @access  Private
 */
router.get('/tools', validateMCPApiKey, async (req, res) => {
  try {
    const tools = mcpService.getAvailableTools();

    res.json({
      success: true,
      data: {
        tools,
        count: tools.length,
        enabled: mcpConfig.tools.enableTools
      }
    });
  } catch (error) {
    logger.error('Failed to get MCP tools:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tools',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/mcp/tools/:toolName/schema
 * @desc    Get tool schema
 * @access  Private
 */
router.get('/tools/:toolName/schema', validateMCPApiKey, async (req, res) => {
  try {
    const { toolName } = req.params;
    const tools = mcpService.getAvailableTools();
    const tool = tools.find(t => t.name === toolName);

    if (!tool) {
      return res.status(404).json({
        success: false,
        error: 'Tool not found',
        code: 'TOOL_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: {
        name: tool.name,
        description: tool.description,
        schema: tool.schema
      }
    });
  } catch (error) {
    logger.error('Failed to get tool schema:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tool schema',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/mcp/prompts
 * @desc    Get available prompt templates
 * @access  Private
 */
router.get('/prompts', validateMCPApiKey, async (req, res) => {
  try {
    const prompts = mcpService.getPromptTemplates();

    res.json({
      success: true,
      data: {
        prompts,
        count: prompts.length
      }
    });
  } catch (error) {
    logger.error('Failed to get MCP prompts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get prompts',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/mcp/context/:sessionId
 * @desc    Get context for a session
 * @access  Private
 */
router.get('/context/:sessionId', validateMCPApiKey, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const context = mcpService.contextManager?.getContext(sessionId);

    if (!context) {
      return res.status(404).json({
        success: false,
        error: 'Context not found',
        code: 'CONTEXT_NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: {
        sessionId,
        context: {
          id: context.id,
          metadata: context.metadata,
          historyLength: context.history.length,
          dataKeys: Object.keys(context.data)
        }
      }
    });
  } catch (error) {
    logger.error('Failed to get MCP context:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get context',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/mcp/context
 * @desc    Create or update context
 * @access  Private
 */
router.post('/context',
  validateMCPApiKey,
  contextValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { sessionId, data = {} } = req.body;

      // Create or update context
      let context = mcpService.contextManager?.getContext(sessionId);
      if (!context) {
        context = mcpService.contextManager?.createContext(sessionId, data);
      } else {
        mcpService.contextManager?.updateContext(sessionId, data, 'manual_update');
      }

      res.json({
        success: true,
        data: {
          sessionId,
          context: {
            id: context.id,
            metadata: context.metadata,
            historyLength: context.history.length
          }
        }
      });
    } catch (error) {
      logger.error('Failed to create/update MCP context:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create/update context',
        details: error.message
      });
    }
  }
);

/**
 * @route   DELETE /api/mcp/context/:sessionId
 * @desc    Clear context for a session
 * @access  Private
 */
router.delete('/context/:sessionId', validateMCPApiKey, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    mcpService.contextManager?.clearContext(sessionId);

    res.json({
      success: true,
      data: {
        sessionId,
        message: 'Context cleared successfully'
      }
    });
  } catch (error) {
    logger.error('Failed to clear MCP context:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear context',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/mcp/resources
 * @desc    List available resources
 * @access  Private
 */
router.get('/resources', validateMCPApiKey, async (req, res) => {
  try {
    const serverInfo = mcpUtils.getServerInfo();

    res.json({
      success: true,
      data: {
        resources: serverInfo.resources,
        count: serverInfo.resources.length,
        capabilities: mcpConfig.resources
      }
    });
  } catch (error) {
    logger.error('Failed to get MCP resources:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get resources',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/mcp/health
 * @desc    Health check for MCP service
 * @access  Public
 */
router.post('/health', async (req, res) => {
  try {
    const status = mcpService.getStatus();
    const isHealthy = status.initialized && 
                     status.aiProvider && 
                     status.contextManager && 
                     status.toolEngine;

    res.json({
      success: true,
      data: {
        healthy: isHealthy,
        status,
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      }
    });
  } catch (error) {
    logger.error('MCP health check failed:', error);
    res.status(500).json({
      success: false,
      data: {
        healthy: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// ========================================
// ERROR HANDLING
// ========================================

/**
 * Handle 404 for MCP routes
 */
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'MCP endpoint not found',
    code: 'MCP_ENDPOINT_NOT_FOUND',
    availableEndpoints: [
      'GET /api/mcp/status',
      'POST /api/mcp/chat',
      'POST /api/mcp/tools/execute',
      'GET /api/mcp/tools',
      'GET /api/mcp/tools/:toolName/schema',
      'GET /api/mcp/prompts',
      'GET /api/mcp/context/:sessionId',
      'POST /api/mcp/context',
      'DELETE /api/mcp/context/:sessionId',
      'GET /api/mcp/resources',
      'POST /api/mcp/health'
    ]
  });
});

module.exports = router; 