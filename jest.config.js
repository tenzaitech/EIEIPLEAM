/**
 * Jest Configuration for TENZAI Express.js Backend
 * Testing framework configuration
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 */

module.exports = {
  // ========================================
  // TEST ENVIRONMENT
  // ========================================
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },

  // ========================================
  // TEST PATTERNS
  // ========================================
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/',
    '/coverage/',
  ],

  // ========================================
  // COVERAGE CONFIGURATION
  // ========================================
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/server.js',
    '!src/config/**',
    '!src/migrations/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov',
    'html',
    'json',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },

  // ========================================
  // SETUP AND TEARDOWN
  // ========================================
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup.js',
  ],
  globalSetup: '<rootDir>/tests/globalSetup.js',
  globalTeardown: '<rootDir>/tests/globalTeardown.js',

  // ========================================
  // TRANSFORM CONFIGURATION
  // ========================================
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@babel/runtime)/)',
  ],

  // ========================================
  // MODULE RESOLUTION
  // ========================================
  moduleDirectories: [
    'node_modules',
    'src',
  ],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@validators/(.*)$': '<rootDir>/src/validators/$1',
  },

  // ========================================
  // TIMEOUT CONFIGURATION
  // ========================================
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // ========================================
  // VERBOSE AND SILENT
  // ========================================
  verbose: true,
  silent: false,

  // ========================================
  // WATCH CONFIGURATION
  // ========================================
  watchPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/logs/',
  ],

  // ========================================
  // CLEAR MOCKS
  // ========================================
  clearMocks: true,
  restoreMocks: true,

  // ========================================
  // FORCE EXIT
  // ========================================
  forceExit: true,

  // ========================================
  // DETECT OPEN HANDLES
  // ========================================
  detectOpenHandles: true,

  // ========================================
  // EXTRA CONFIGURATION
  // ========================================
  testRunner: 'jest-circus/runner',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],
}; 