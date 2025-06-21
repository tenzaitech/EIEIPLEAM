/**
 * 🔐 Authentication Routes
 * User authentication and authorization endpoints for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Authentication routes with JWT and bcrypt
 */

const express = require('express');
const { body } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateRequest } = require('../middleware/validationMiddleware');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// ========================================
// VALIDATION SCHEMAS
// ========================================
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
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
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
];

const forgotPasswordValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
];

const resetPasswordValidation = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
];

// ========================================
// AUTHENTICATION ROUTES
// ========================================

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  registerValidation,
  validateRequest,
  asyncHandler(authController.register)
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and return JWT token
 * @access  Public
 */
router.post(
  '/login',
  loginValidation,
  validateRequest,
  asyncHandler(authController.login)
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (invalidate token)
 * @access  Private
 */
router.post(
  '/logout',
  authenticateToken,
  asyncHandler(authController.logout)
);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh JWT token
 * @access  Public
 */
router.post(
  '/refresh',
  asyncHandler(authController.refreshToken)
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  authenticateToken,
  asyncHandler(authController.getProfile)
);

/**
 * @route   PUT /api/v1/auth/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/me',
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
  ],
  validateRequest,
  asyncHandler(authController.updateProfile)
);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/change-password',
  authenticateToken,
  changePasswordValidation,
  validateRequest,
  asyncHandler(authController.changePassword)
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post(
  '/forgot-password',
  forgotPasswordValidation,
  validateRequest,
  asyncHandler(authController.forgotPassword)
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  resetPasswordValidation,
  validateRequest,
  asyncHandler(authController.resetPassword)
);

/**
 * @route   POST /api/v1/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post(
  '/verify-email',
  [
    body('token')
      .notEmpty()
      .withMessage('Verification token is required'),
  ],
  validateRequest,
  asyncHandler(authController.verifyEmail)
);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend email verification
 * @access  Public
 */
router.post(
  '/resend-verification',
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
  ],
  validateRequest,
  asyncHandler(authController.resendVerification)
);

/**
 * @route   POST /api/v1/auth/google
 * @desc    Google OAuth login
 * @access  Public
 */
router.post(
  '/google',
  [
    body('token')
      .notEmpty()
      .withMessage('Google token is required'),
  ],
  validateRequest,
  asyncHandler(authController.googleLogin)
);

/**
 * @route   POST /api/v1/auth/facebook
 * @desc    Facebook OAuth login
 * @access  Public
 */
router.post(
  '/facebook',
  [
    body('token')
      .notEmpty()
      .withMessage('Facebook token is required'),
  ],
  validateRequest,
  asyncHandler(authController.facebookLogin)
);

/**
 * @route   DELETE /api/v1/auth/me
 * @desc    Delete current user account
 * @access  Private
 */
router.delete(
  '/me',
  authenticateToken,
  [
    body('password')
      .notEmpty()
      .withMessage('Password is required for account deletion'),
  ],
  validateRequest,
  asyncHandler(authController.deleteAccount)
);

// ========================================
// ADMIN ROUTES (ADMIN ONLY)
// ========================================

/**
 * @route   GET /api/v1/auth/users
 * @desc    Get all users (admin only)
 * @access  Private (Admin)
 */
router.get(
  '/users',
  authenticateToken,
  asyncHandler(authController.getAllUsers)
);

/**
 * @route   GET /api/v1/auth/users/:id
 * @desc    Get user by ID (admin only)
 * @access  Private (Admin)
 */
router.get(
  '/users/:id',
  authenticateToken,
  asyncHandler(authController.getUserById)
);

/**
 * @route   PUT /api/v1/auth/users/:id
 * @desc    Update user by ID (admin only)
 * @access  Private (Admin)
 */
router.put(
  '/users/:id',
  authenticateToken,
  asyncHandler(authController.updateUserById)
);

/**
 * @route   DELETE /api/v1/auth/users/:id
 * @desc    Delete user by ID (admin only)
 * @access  Private (Admin)
 */
router.delete(
  '/users/:id',
  authenticateToken,
  asyncHandler(authController.deleteUserById)
);

// ========================================
// HEALTH CHECK ROUTE
// ========================================

/**
 * @route   GET /api/v1/auth/health
 * @desc    Authentication service health check
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'Authentication Service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    message: 'Authentication service is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router; 