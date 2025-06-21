/**
 * 🔐 Auth Controller
 * Authentication and authorization controller
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Controller for user authentication and authorization
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { logger } = require('../utils/logger');

// Mock user data for testing (in production, use database)
const mockUsers = [
  {
    id: '1',
    email: 'admin@tenzaitech.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // password: admin123
    name: 'Admin User',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'user@tenzaitech.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2O', // password: user123
    name: 'Regular User',
    role: 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * User Login
 * POST /api/v1/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      logger.warn('Login failed: User not found', { email });
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
          details: ['Please check your email and password']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Check if user is active
    if (!user.isActive) {
      logger.warn('Login failed: Inactive user', { email });
      return res.status(401).json({
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: 'Account is deactivated',
          details: ['Please contact administrator']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      logger.warn('Login failed: Invalid password', { email });
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password',
          details: ['Please check your email and password']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        type: 'refresh'
      },
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
      }
    );

    // Log successful login
    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      },
      message: 'Login successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * User Registration
 * POST /api/v1/auth/register
 */
const register = async (req, res) => {
  try {
    const { email, password, name, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
      logger.warn('Registration failed: User already exists', { email });
      return res.status(409).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User already exists',
          details: ['A user with this email already exists']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Hash password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user (in production, save to database)
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      password: hashedPassword,
      name,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock users (in production, save to database)
    mockUsers.push(newUser);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );

    // Log successful registration
    logger.info('User registered successfully', {
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      },
      message: 'Registration successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Refresh Token
 * POST /api/v1/auth/refresh
 */
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Refresh token is required',
          details: ['Please provide a refresh token']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret'
    );

    // Find user
    const user = mockUsers.find(u => u.id === decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid refresh token',
          details: ['Please login again']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Generate new access token
    const newToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );

    // Log token refresh
    logger.info('Token refreshed successfully', {
      userId: user.id,
      email: user.email
    });

    // Return new token
    res.status(200).json({
      success: true,
      data: {
        token: newToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      },
      message: 'Token refreshed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid refresh token',
          details: ['Please login again']
        },
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Refresh token expired',
          details: ['Please login again']
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Logout
 * POST /api/v1/auth/logout
 */
const logout = async (req, res) => {
  try {
    // In production, you might want to blacklist the token
    // For now, just return success response
    
    logger.info('User logged out', {
      userId: req.user?.userId,
      email: req.user?.email
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get Current User
 * GET /api/v1/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    const user = mockUsers.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          details: ['User does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      message: 'User profile retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get Current User Profile
 * GET /api/v1/auth/me
 */
const getProfile = async (req, res) => {
  try {
    const user = mockUsers.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          details: ['User does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      message: 'User profile retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Update Current User Profile
 * PUT /api/v1/auth/me
 */
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = mockUsers.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          details: ['User does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Update user data
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    user.updatedAt = new Date();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      message: 'Profile updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Change Password
 * POST /api/v1/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = mockUsers.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          details: ['User does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Current password is incorrect',
          details: ['Please provide the correct current password']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Hash new password
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    user.password = hashedNewPassword;
    user.updatedAt = new Date();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Forgot Password
 * POST /api/v1/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // In production, send reset email
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      details: ['If an account with this email exists, you will receive a reset link'],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Reset Password
 * POST /api/v1/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // In production, verify reset token
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Verify Email
 * POST /api/v1/auth/verify-email
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    
    // In production, verify email token
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Resend Verification
 * POST /api/v1/auth/resend-verification
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    // In production, resend verification email
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Verification email sent',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Google OAuth Login
 * POST /api/v1/auth/google
 */
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // In production, verify Google token
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Google login successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Google login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Facebook OAuth Login
 * POST /api/v1/auth/facebook
 */
const facebookLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // In production, verify Facebook token
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Facebook login successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Facebook login error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Delete Account
 * DELETE /api/v1/auth/me
 */
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = mockUsers.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          details: ['User does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Password is incorrect',
          details: ['Please provide the correct password']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Delete user (in production, soft delete)
    const userIndex = mockUsers.findIndex(u => u.id === req.user.userId);
    if (userIndex > -1) {
      mockUsers.splice(userIndex, 1);
    }

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get All Users (Admin)
 * GET /api/v1/auth/users
 */
const getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Access denied',
          details: ['Admin role required']
        },
        timestamp: new Date().toISOString()
      });
    }

    const users = mockUsers.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: {
        users,
        total: users.length
      },
      message: 'Users retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Get User By ID (Admin)
 * GET /api/v1/auth/users/:id
 */
const getUserById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Access denied',
          details: ['Admin role required']
        },
        timestamp: new Date().toISOString()
      });
    }

    const { id } = req.params;
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          details: ['User does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      message: 'User retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Update User By ID (Admin)
 * PUT /api/v1/auth/users/:id
 */
const updateUserById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Access denied',
          details: ['Admin role required']
        },
        timestamp: new Date().toISOString()
      });
    }

    const { id } = req.params;
    const { name, role, isActive } = req.body;
    const user = mockUsers.find(u => u.id === id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          details: ['User does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Update user data
    if (name) user.name = name;
    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    user.updatedAt = new Date();

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      message: 'User updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Update user by ID error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Delete User By ID (Admin)
 * DELETE /api/v1/auth/users/:id
 */
const deleteUserById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Access denied',
          details: ['Admin role required']
        },
        timestamp: new Date().toISOString()
      });
    }

    const { id } = req.params;
    const userIndex = mockUsers.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found',
          details: ['User does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Delete user
    mockUsers.splice(userIndex, 1);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Delete user by ID error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: ['An unexpected error occurred']
      },
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = {
  login,
  register,
  refreshToken,
  logout,
  getCurrentUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  googleLogin,
  facebookLogin,
  deleteAccount,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
}; 