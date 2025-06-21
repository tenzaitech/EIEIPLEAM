/**
 * 🤖 MCP (Model Context Protocol) Configuration
 * AI Integration and Context Management for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description MCP configuration for AI-powered features and context management
 */

const { logger } = require('../utils/logger');

// ========================================
// MCP CONFIGURATION
// ========================================
const mcpConfig = {
  // MCP Server Configuration
  server: {
    enabled: process.env.MCP_ENABLED === 'true',
    port: parseInt(process.env.MCP_PORT) || 3001,
    host: process.env.MCP_HOST || 'localhost',
    protocol: process.env.MCP_PROTOCOL || 'http',
    timeout: parseInt(process.env.MCP_TIMEOUT) || 30000,
  },

  // AI Model Configuration
  ai: {
    provider: process.env.AI_PROVIDER || 'openai', // openai, anthropic, local
    model: process.env.AI_MODEL || 'gpt-4',
    apiKey: process.env.AI_API_KEY,
    maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 4000,
    temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
  },

  // Context Management
  context: {
    maxContextSize: parseInt(process.env.MAX_CONTEXT_SIZE) || 10000,
    contextWindow: parseInt(process.env.CONTEXT_WINDOW) || 8000,
    enableMemory: process.env.ENABLE_MEMORY === 'true',
    memoryRetention: parseInt(process.env.MEMORY_RETENTION) || 24, // hours
  },

  // Resource Management
  resources: {
    enableFileAccess: process.env.ENABLE_FILE_ACCESS === 'true',
    enableDatabaseAccess: process.env.ENABLE_DATABASE_ACCESS === 'true',
    enableApiAccess: process.env.ENABLE_API_ACCESS === 'true',
    allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      '.txt', '.md', '.json', '.csv', '.xlsx', '.pdf'
    ],
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
  },

  // Tool Integration
  tools: {
    enableTools: process.env.ENABLE_TOOLS === 'true',
    availableTools: process.env.AVAILABLE_TOOLS?.split(',') || [
      'search', 'calculate', 'analyze', 'generate', 'validate'
    ],
    toolTimeout: parseInt(process.env.TOOL_TIMEOUT) || 30000,
  },

  // Security Configuration
  security: {
    enableAuth: process.env.MCP_ENABLE_AUTH === 'true',
    apiKeyRequired: process.env.MCP_API_KEY_REQUIRED === 'true',
    rateLimit: {
      enabled: process.env.MCP_RATE_LIMIT_ENABLED === 'true',
      windowMs: parseInt(process.env.MCP_RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
      max: parseInt(process.env.MCP_RATE_LIMIT_MAX) || 100,
    },
    allowedOrigins: process.env.MCP_ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://claude.ai',
      'https://claude-desktop.app'
    ],
  },

  // Logging and Monitoring
  logging: {
    enableAILogging: process.env.ENABLE_AI_LOGGING === 'true',
    logPrompts: process.env.LOG_PROMPTS === 'true',
    logResponses: process.env.LOG_RESPONSES === 'true',
    logPerformance: process.env.LOG_PERFORMANCE === 'true',
  },
};

// ========================================
// MCP SERVER CAPABILITIES
// ========================================
const mcpCapabilities = {
  // Resource Capabilities
  resources: {
    listResources: true,
    readResource: true,
    searchResources: true,
    watchResource: true,
  },

  // Tool Capabilities
  tools: {
    listTools: true,
    callTool: true,
    getToolSchema: true,
  },

  // Prompt Capabilities
  prompts: {
    listPrompts: true,
    getPrompt: true,
    putPrompt: true,
    deletePrompt: true,
  },

  // Sampling Capabilities
  sampling: {
    sampleCompletions: true,
    streamCompletions: true,
  },
};

// ========================================
// MCP RESOURCE TYPES
// ========================================
const mcpResourceTypes = {
  // Database Resources
  database: {
    users: 'application/json',
    suppliers: 'application/json',
    materials: 'application/json',
    purchaseOrders: 'application/json',
    inventory: 'application/json',
  },

  // File Resources
  files: {
    documents: 'application/pdf',
    spreadsheets: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    images: 'image/*',
    logs: 'text/plain',
  },

  // API Resources
  api: {
    endpoints: 'application/json',
    schemas: 'application/json',
    metrics: 'application/json',
  },
};

// ========================================
// MCP TOOL DEFINITIONS
// ========================================
const mcpTools = {
  // Data Analysis Tools
  analyzeData: {
    name: 'analyze_data',
    description: 'Analyze data from various sources',
    inputSchema: {
      type: 'object',
      properties: {
        source: { type: 'string', enum: ['users', 'suppliers', 'materials', 'purchaseOrders'] },
        analysis: { type: 'string', enum: ['trends', 'patterns', 'statistics', 'anomalies'] },
        filters: { type: 'object' },
      },
      required: ['source', 'analysis'],
    },
  },

  // Report Generation Tools
  generateReport: {
    name: 'generate_report',
    description: 'Generate comprehensive reports',
    inputSchema: {
      type: 'object',
      properties: {
        reportType: { type: 'string', enum: ['inventory', 'purchasing', 'supplier', 'financial'] },
        period: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'] },
        format: { type: 'string', enum: ['pdf', 'excel', 'json', 'html'] },
        filters: { type: 'object' },
      },
      required: ['reportType', 'period'],
    },
  },

  // Prediction Tools
  predictTrends: {
    name: 'predict_trends',
    description: 'Predict future trends based on historical data',
    inputSchema: {
      type: 'object',
      properties: {
        metric: { type: 'string', enum: ['demand', 'cost', 'supply', 'sales'] },
        horizon: { type: 'integer', minimum: 1, maximum: 365 },
        confidence: { type: 'number', minimum: 0.1, maximum: 0.99 },
      },
      required: ['metric', 'horizon'],
    },
  },

  // Optimization Tools
  optimizeInventory: {
    name: 'optimize_inventory',
    description: 'Optimize inventory levels and reorder points',
    inputSchema: {
      type: 'object',
      properties: {
        materials: { type: 'array', items: { type: 'string' } },
        strategy: { type: 'string', enum: ['minimize_cost', 'maximize_availability', 'balanced'] },
        constraints: { type: 'object' },
      },
      required: ['strategy'],
    },
  },

  // Validation Tools
  validateData: {
    name: 'validate_data',
    description: 'Validate data quality and consistency',
    inputSchema: {
      type: 'object',
      properties: {
        dataset: { type: 'string', enum: ['users', 'suppliers', 'materials', 'purchaseOrders'] },
        rules: { type: 'array', items: { type: 'string' } },
        severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
      },
      required: ['dataset'],
    },
  },
};

// ========================================
// MCP PROMPT TEMPLATES
// ========================================
const mcpPromptTemplates = {
  // Analysis Prompts
  dataAnalysis: {
    name: 'data_analysis',
    description: 'Template for data analysis tasks',
    prompt: `Analyze the following data from the TENZAI Purchasing System:

Context: {context}
Data Source: {source}
Analysis Type: {analysis_type}

Please provide:
1. Key insights and patterns
2. Statistical summary
3. Recommendations
4. Potential issues or anomalies

Focus on actionable insights for business decision-making.`,
  },

  // Report Generation Prompts
  reportGeneration: {
    name: 'report_generation',
    description: 'Template for generating business reports',
    prompt: `Generate a comprehensive {report_type} report for the TENZAI Purchasing System:

Period: {period}
Data: {data}
Requirements: {requirements}

Please include:
1. Executive summary
2. Key metrics and KPIs
3. Trend analysis
4. Recommendations
5. Action items

Format the report in a professional business style.`,
  },

  // Optimization Prompts
  optimization: {
    name: 'optimization',
    description: 'Template for optimization tasks',
    prompt: `Optimize the following aspect of the TENZAI Purchasing System:

Area: {area}
Current State: {current_state}
Objectives: {objectives}
Constraints: {constraints}

Please provide:
1. Current performance analysis
2. Optimization opportunities
3. Implementation plan
4. Expected outcomes
5. Risk assessment

Focus on practical, implementable solutions.`,
  },
};

// ========================================
// MCP UTILITY FUNCTIONS
// ========================================
const mcpUtils = {
  /**
   * Validate MCP configuration
   */
  validateConfig: () => {
    const errors = [];

    if (mcpConfig.ai.provider === 'openai' && !mcpConfig.ai.apiKey) {
      errors.push('OpenAI API key is required when using OpenAI provider');
    }

    if (mcpConfig.server.enabled && !mcpConfig.server.port) {
      errors.push('MCP server port is required when MCP is enabled');
    }

    if (errors.length > 0) {
      logger.error('MCP Configuration Errors:', errors);
      return false;
    }

    return true;
  },

  /**
   * Get MCP server info
   */
  getServerInfo: () => {
    return {
      name: 'TENZAI MCP Server',
      version: '1.0.0',
      description: 'MCP server for TENZAI Purchasing System',
      capabilities: mcpCapabilities,
      resources: Object.keys(mcpResourceTypes),
      tools: Object.keys(mcpTools),
      prompts: Object.keys(mcpPromptTemplates),
    };
  },

  /**
   * Check if MCP is enabled
   */
  isEnabled: () => {
    return mcpConfig.server.enabled;
  },

  /**
   * Get resource type for given resource
   */
  getResourceType: (resourceName) => {
    for (const category in mcpResourceTypes) {
      if (mcpResourceTypes[category][resourceName]) {
        return mcpResourceTypes[category][resourceName];
      }
    }
    return 'application/json'; // Default
  },

  /**
   * Validate tool input against schema
   */
  validateToolInput: (toolName, input) => {
    const tool = mcpTools[toolName];
    if (!tool) {
      return { valid: false, error: 'Tool not found' };
    }

    // Basic validation - in production, use a proper JSON schema validator
    const required = tool.inputSchema.required || [];
    for (const field of required) {
      if (!input[field]) {
        return { valid: false, error: `Missing required field: ${field}` };
      }
    }

    return { valid: true };
  },
};

// ========================================
// EXPORT CONFIGURATION AND UTILITIES
// ========================================
module.exports = {
  mcpConfig,
  mcpCapabilities,
  mcpResourceTypes,
  mcpTools,
  mcpPromptTemplates,
  mcpUtils,
}; 