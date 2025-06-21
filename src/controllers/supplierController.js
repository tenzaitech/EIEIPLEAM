/**
 * 🏢 Supplier Controller
 * Supplier management controller
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Controller for supplier management operations
 */

const { logger } = require('../utils/logger');

// Mock supplier data for testing
const mockSuppliers = [
  {
    id: '1',
    name: 'ABC Food Supplies',
    email: 'contact@abcfood.com',
    phone: '+66-2-123-4567',
    address: '123 Food Street, Bangkok',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * Get All Suppliers
 * GET /api/v1/suppliers
 */
const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = mockSuppliers.map(supplier => ({
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      isActive: supplier.isActive,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: {
        suppliers,
        total: suppliers.length
      },
      message: 'Suppliers retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get all suppliers error:', error);
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
 * Get Supplier By ID
 * GET /api/v1/suppliers/:id
 */
const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = mockSuppliers.find(s => s.id === id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SUPPLIER_NOT_FOUND',
          message: 'Supplier not found',
          details: ['Supplier does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: { supplier },
      message: 'Supplier retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get supplier by ID error:', error);
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
 * Create Supplier
 * POST /api/v1/suppliers
 */
const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const newSupplier = {
      id: (mockSuppliers.length + 1).toString(),
      name,
      email,
      phone,
      address,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockSuppliers.push(newSupplier);

    res.status(201).json({
      success: true,
      data: { supplier: newSupplier },
      message: 'Supplier created successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Create supplier error:', error);
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
 * Update Supplier
 * PUT /api/v1/suppliers/:id
 */
const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, isActive } = req.body;
    
    const supplier = mockSuppliers.find(s => s.id === id);
    
    if (!supplier) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SUPPLIER_NOT_FOUND',
          message: 'Supplier not found',
          details: ['Supplier does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Update supplier data
    if (name) supplier.name = name;
    if (email) supplier.email = email;
    if (phone) supplier.phone = phone;
    if (address) supplier.address = address;
    if (typeof isActive === 'boolean') supplier.isActive = isActive;
    supplier.updatedAt = new Date();

    res.status(200).json({
      success: true,
      data: { supplier },
      message: 'Supplier updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Update supplier error:', error);
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
 * Delete Supplier
 * DELETE /api/v1/suppliers/:id
 */
const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const supplierIndex = mockSuppliers.findIndex(s => s.id === id);
    
    if (supplierIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SUPPLIER_NOT_FOUND',
          message: 'Supplier not found',
          details: ['Supplier does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    mockSuppliers.splice(supplierIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Supplier deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Delete supplier error:', error);
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
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier
}; 