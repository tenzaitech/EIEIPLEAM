/**
 * 👥 User Routes
 * User management endpoints for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description User management routes with role-based access control
 */

const express = require('express');
const { body, query, param } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateRequest } = require('../middleware/validationMiddleware');
const userController = require('../controllers/userController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// ========================================
// VALIDATION SCHEMAS
// ========================================
const createUserValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'manager', 'user'])
    .withMessage('Role must be admin, manager, or user'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
];

const updateUserValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid user ID format'),
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Search term must be between 2 and 100 characters'),
  query('role')
    .optional()
    .isIn(['admin', 'manager', 'user'])
    .withMessage('Role must be admin, manager, or user'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  query('sortBy')
    .optional()
    .isIn(['firstName', 'lastName', 'email', 'role', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

// ========================================
// USER MANAGEMENT ROUTES
// ========================================

/**
 * @route   GET /api/v1/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin, Manager)
 */
router.get(
  '/',
  authenticateToken,
  requireRole(['admin', 'manager']),
  queryValidation,
  validateRequest,
  asyncHandler(userController.getAllUsers)
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Get user by ID
 * @access  Private (Admin, Manager, Self)
 */
router.get(
  '/:id',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format'),
  ],
  validateRequest,
  asyncHandler(userController.getUserById)
);

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticateToken,
  requireRole(['admin']),
  createUserValidation,
  validateRequest,
  asyncHandler(userController.createUser)
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Update user by ID
 * @access  Private (Admin, Manager, Self)
 */
router.put(
  '/:id',
  authenticateToken,
  updateUserValidation,
  validateRequest,
  asyncHandler(userController.updateUser)
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete user by ID (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format'),
  ],
  validateRequest,
  asyncHandler(userController.deleteUser)
);

/**
 * @route   PATCH /api/v1/users/:id/activate
 * @desc    Activate user account
 * @access  Private (Admin)
 */
router.patch(
  '/:id/activate',
  authenticateToken,
  requireRole(['admin']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format'),
  ],
  validateRequest,
  asyncHandler(userController.activateUser)
);

/**
 * @route   PATCH /api/v1/users/:id/deactivate
 * @desc    Deactivate user account
 * @access  Private (Admin)
 */
router.patch(
  '/:id/deactivate',
  authenticateToken,
  requireRole(['admin']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format'),
  ],
  validateRequest,
  asyncHandler(userController.deactivateUser)
);

/**
 * @route   PATCH /api/v1/users/:id/role
 * @desc    Update user role
 * @access  Private (Admin)
 */
router.patch(
  '/:id/role',
  authenticateToken,
  requireRole(['admin']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format'),
    body('role')
      .isIn(['admin', 'manager', 'user'])
      .withMessage('Role must be admin, manager, or user'),
  ],
  validateRequest,
  asyncHandler(userController.updateUserRole)
);

/**
 * @route   POST /api/v1/users/:id/reset-password
 * @desc    Reset user password (admin only)
 * @access  Private (Admin)
 */
router.post(
  '/:id/reset-password',
  authenticateToken,
  requireRole(['admin']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid user ID format'),
  ],
  validateRequest,
  asyncHandler(userController.resetUserPassword)
);

// ========================================
// USER PROFILE ROUTES
// ========================================

/**
 * @route   GET /api/v1/users/profile/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/profile/me',
  authenticateToken,
  asyncHandler(userController.getMyProfile)
);

/**
 * @route   PUT /api/v1/users/profile/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/profile/me',
  authenticateToken,
  [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('avatar')
      .optional()
      .isURL()
      .withMessage('Avatar must be a valid URL'),
  ],
  validateRequest,
  asyncHandler(userController.updateMyProfile)
);

/**
 * @route   POST /api/v1/users/profile/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
router.post(
  '/profile/avatar',
  authenticateToken,
  asyncHandler(userController.uploadAvatar)
);

/**
 * @route   DELETE /api/v1/users/profile/avatar
 * @desc    Remove user avatar
 * @access  Private
 */
router.delete(
  '/profile/avatar',
  authenticateToken,
  asyncHandler(userController.removeAvatar)
);

// ========================================
// USER STATISTICS ROUTES
// ========================================

/**
 * @route   GET /api/v1/users/stats/overview
 * @desc    Get user statistics overview
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/overview',
  authenticateToken,
  requireRole(['admin', 'manager']),
  asyncHandler(userController.getUserStats)
);

/**
 * @route   GET /api/v1/users/stats/activity
 * @desc    Get user activity statistics
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/activity',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    query('period')
      .optional()
      .isIn(['day', 'week', 'month', 'year'])
      .withMessage('Period must be day, week, month, or year'),
  ],
  validateRequest,
  asyncHandler(userController.getUserActivityStats)
);

/**
 * @route   GET /api/v1/users/stats/roles
 * @desc    Get user statistics by role
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/roles',
  authenticateToken,
  requireRole(['admin', 'manager']),
  asyncHandler(userController.getUserRoleStats)
);

// ========================================
// USER BULK OPERATIONS
// ========================================

/**
 * @route   POST /api/v1/users/bulk/import
 * @desc    Import users from CSV/Excel
 * @access  Private (Admin)
 */
router.post(
  '/bulk/import',
  authenticateToken,
  requireRole(['admin']),
  asyncHandler(userController.bulkImportUsers)
);

/**
 * @route   POST /api/v1/users/bulk/export
 * @desc    Export users to CSV/Excel
 * @access  Private (Admin, Manager)
 */
router.post(
  '/bulk/export',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    body('format')
      .optional()
      .isIn(['csv', 'excel', 'json'])
      .withMessage('Format must be csv, excel, or json'),
    body('filters')
      .optional()
      .isObject()
      .withMessage('Filters must be an object'),
  ],
  validateRequest,
  asyncHandler(userController.bulkExportUsers)
);

/**
 * @route   PATCH /api/v1/users/bulk/update
 * @desc    Bulk update users
 * @access  Private (Admin)
 */
router.patch(
  '/bulk/update',
  authenticateToken,
  requireRole(['admin']),
  [
    body('userIds')
      .isArray({ min: 1 })
      .withMessage('User IDs must be an array with at least one ID'),
    body('updates')
      .isObject()
      .withMessage('Updates must be an object'),
  ],
  validateRequest,
  asyncHandler(userController.bulkUpdateUsers)
);

// ========================================
// HEALTH CHECK ROUTE
// ========================================

/**
 * @route   GET /api/v1/users/health
 * @desc    User service health check
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'User Management Service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    message: 'User service is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router; 