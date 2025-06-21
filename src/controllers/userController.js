/**
 * 👥 User Controller
 * User management controller
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Controller for user management operations
 */

const { logger } = require('../utils/logger');

// Mock user data for testing (in production, use database)
const mockUsers = [
  {
    id: '1',
    email: 'admin@tenzaitech.com',
    name: 'Admin User',
    role: 'admin',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'user@tenzaitech.com',
    name: 'Regular User',
    role: 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * Get All Users
 * GET /api/v1/users
 */
const getAllUsers = async (req, res) => {
  try {
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
 * Get User By ID
 * GET /api/v1/users/:id
 */
const getUserById = async (req, res) => {
  try {
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
 * Create User
 * POST /api/v1/users
 */
const createUser = async (req, res) => {
  try {
    const { email, name, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    
    if (existingUser) {
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

    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      name,
      role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUsers.push(newUser);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt
        }
      },
      message: 'User created successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Create user error:', error);
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
 * Update User
 * PUT /api/v1/users/:id
 */
const updateUser = async (req, res) => {
  try {
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
    logger.error('Update user error:', error);
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
 * Delete User
 * DELETE /api/v1/users/:id
 */
const deleteUser = async (req, res) => {
  try {
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
    logger.error('Delete user error:', error);
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
 * Get My Profile
 * GET /api/v1/users/profile/me
 */
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = mockUsers.find(u => u.id === userId);
    
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
      message: 'Profile retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get my profile error:', error);
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
 * Update My Profile
 * PUT /api/v1/users/profile/me
 */
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body;
    
    const user = mockUsers.find(u => u.id === userId);
    
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
    logger.error('Update my profile error:', error);
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
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMyProfile,
  updateMyProfile
}; 