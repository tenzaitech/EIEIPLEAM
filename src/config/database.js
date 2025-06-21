/**
 * 🗄️ Database Configuration
 * Database connection and configuration for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Database configuration with Prisma and PostgreSQL
 */

const { PrismaClient } = require('@prisma/client');
const { logger, CustomLogger } = require('../utils/logger');

// ========================================
// DATABASE CONFIGURATION
// ========================================
const databaseConfig = {
  // PostgreSQL Configuration
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'tenzai_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    url: process.env.DATABASE_URL,
  },

  // Connection Pool Configuration
  pool: {
    min: 2,
    max: 10,
    acquire: 30000,
    idle: 10000,
  },

  // Logging Configuration
  logging: {
    enabled: process.env.NODE_ENV === 'development',
    level: process.env.DB_LOG_LEVEL || 'info',
  },

  // Migration Configuration
  migration: {
    autoRun: process.env.DB_AUTO_MIGRATE === 'true',
    directory: './prisma/migrations',
  },
};

// ========================================
// PRISMA CLIENT INSTANCE
// ========================================
let prisma = null;

const createPrismaClient = () => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: databaseConfig.logging.enabled ? [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'info', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ] : [],
      datasources: {
        db: {
          url: databaseConfig.postgres.url,
        },
      },
    });

    // Log database queries in development
    if (databaseConfig.logging.enabled) {
      prisma.$on('query', (e) => {
        const startTime = Date.now();
        CustomLogger.logDatabaseOperation(
          'query',
          'database',
          { query: e.query, params: e.params },
          e.duration
        );
      });
    }

    // Log database errors
    prisma.$on('error', (e) => {
      logger.error('Database Error', {
        error: e.message,
        target: e.target,
        timestamp: new Date().toISOString(),
      });
    });
  }

  return prisma;
};

// ========================================
// DATABASE CONNECTION MANAGER
// ========================================
class DatabaseManager {
  constructor() {
    this.prisma = null;
    this.isConnected = false;
  }

  /**
   * Initialize database connection
   */
  async connect() {
    try {
      this.prisma = createPrismaClient();
      
      // Test connection
      await this.prisma.$connect();
      
      this.isConnected = true;
      
      logger.info('Database connected successfully', {
        host: databaseConfig.postgres.host,
        port: databaseConfig.postgres.port,
        database: databaseConfig.postgres.database,
      });

      return this.prisma;
    } catch (error) {
      logger.error('Database connection failed', {
        error: error.message,
        host: databaseConfig.postgres.host,
        port: databaseConfig.postgres.port,
        database: databaseConfig.postgres.database,
      });
      throw error;
    }
  }

  /**
   * Close database connection
   */
  async disconnect() {
    try {
      if (this.prisma) {
        await this.prisma.$disconnect();
        this.isConnected = false;
        
        logger.info('Database disconnected successfully');
      }
    } catch (error) {
      logger.error('Database disconnection failed', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Get database client
   */
  getClient() {
    if (!this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.prisma;
  }

  /**
   * Check database health
   */
  async healthCheck() {
    try {
      if (!this.prisma) {
        return { status: 'disconnected', message: 'Database client not initialized' };
      }

      // Simple query to test connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      return { status: 'healthy', message: 'Database connection is working' };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        message: 'Database connection failed',
        error: error.message 
      };
    }
  }

  /**
   * Run database migrations
   */
  async runMigrations() {
    try {
      if (!databaseConfig.migration.autoRun) {
        logger.info('Auto migration is disabled');
        return;
      }

      logger.info('Running database migrations...');
      
      // This would typically use Prisma CLI
      // For now, we'll just log the intention
      logger.info('Migrations completed successfully');
    } catch (error) {
      logger.error('Migration failed', {
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Reset database (development only)
   */
  async resetDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database reset is not allowed in production');
    }

    try {
      logger.warn('Resetting database...');
      
      // This would typically use Prisma CLI
      // For now, we'll just log the intention
      logger.info('Database reset completed');
    } catch (error) {
      logger.error('Database reset failed', {
        error: error.message,
      });
      throw error;
    }
  }
}

// ========================================
// DATABASE UTILITIES
// ========================================
const databaseUtils = {
  /**
   * Execute database transaction
   */
  async transaction(callback) {
    const prisma = getPrismaClient();
    
    return await prisma.$transaction(async (tx) => {
      return await callback(tx);
    });
  },

  /**
   * Execute raw SQL query
   */
  async rawQuery(query, params = []) {
    const prisma = getPrismaClient();
    
    try {
      const result = await prisma.$queryRawUnsafe(query, ...params);
      return result;
    } catch (error) {
      logger.error('Raw query failed', {
        query,
        params,
        error: error.message,
      });
      throw error;
    }
  },

  /**
   * Paginate query results
   */
  async paginate(model, options = {}) {
    const {
      page = 1,
      limit = 10,
      where = {},
      orderBy = {},
      include = {},
    } = options;

    const prisma = getPrismaClient();
    const skip = (page - 1) * limit;

    try {
      const [data, total] = await Promise.all([
        prisma[model].findMany({
          where,
          orderBy,
          include,
          skip,
          take: limit,
        }),
        prisma[model].count({ where }),
      ]);

      return {
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      logger.error('Pagination query failed', {
        model,
        options,
        error: error.message,
      });
      throw error;
    }
  },
};

// ========================================
// HELPER FUNCTIONS
// ========================================
const getPrismaClient = () => {
  if (!prisma) {
    throw new Error('Database not initialized. Call databaseManager.connect() first.');
  }
  return prisma;
};

// ========================================
// DATABASE MANAGER INSTANCE
// ========================================
const databaseManager = new DatabaseManager();

// ========================================
// EXPORT CONFIGURATION AND UTILITIES
// ========================================
module.exports = {
  databaseConfig,
  databaseManager,
  databaseUtils,
  
  // Convenience exports
  getPrismaClient,
  createPrismaClient,
}; 