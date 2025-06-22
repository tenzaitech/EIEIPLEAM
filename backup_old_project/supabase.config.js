/**
 * 🔧 TENZAI - Supabase Configuration
 * Database หลักสำหรับ TENZAI Purchasing System
 */

const SUPABASE_CONFIG = {
  // Supabase Project Settings
  url: 'https://knhbfdhszyybzokaoagj.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuaGJmZGhzenl5Ynpva2FvYWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1ODkzMTgsImV4cCI6MjA2NjE2NTMxOH0.JBB8EmoduL5PKXUId_W1SpZTJ_PXaXuIgNi9BO88P8Y',
  serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtuaGJmZGhzenl5Ynpva2FvYWdqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU4OTMxOCwiZXhwIjoyMDY2MTY1MzE4fQ.y0f67Ci3W0r8azcsal3TX7K5xxIw6HTtGbSImT2H4Pg',
  
  // Database Settings
  database: {
    host: 'knhbfdhszyybzokaoagj.supabase.co',
    port: 5432,
    database: 'postgres',
    schema: 'public'
  },

  // API Settings
  api: {
    timeout: 30000,
    retries: 3
  },

  // Sync Settings
  sync: {
    enabled: true,
    interval: 3600000, // 1 hour
    batchSize: 100
  }
};

module.exports = SUPABASE_CONFIG; 