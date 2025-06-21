/**
 * 📦 Material Controller
 * Material management controller
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Controller for material management operations
 */

const { logger } = require('../utils/logger');

// Mock material data for testing
const mockMaterials = [
  {
    id: '1',
    name: 'Rice',
    category: 'Grains',
    unit: 'kg',
    price: 25.50,
    supplierId: '1',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * Get All Materials
 * GET /api/v1/materials
 */
const getAllMaterials = async (req, res) => {
  try {
    const materials = mockMaterials.map(material => ({
      id: material.id,
      name: material.name,
      category: material.category,
      unit: material.unit,
      price: material.price,
      supplierId: material.supplierId,
      isActive: material.isActive,
      createdAt: material.createdAt,
      updatedAt: material.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: {
        materials,
        total: materials.length
      },
      message: 'Materials retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get all materials error:', error);
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
 * Get Material By ID
 * GET /api/v1/materials/:id
 */
const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const material = mockMaterials.find(m => m.id === id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MATERIAL_NOT_FOUND',
          message: 'Material not found',
          details: ['Material does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: { material },
      message: 'Material retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get material by ID error:', error);
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
 * Create Material
 * POST /api/v1/materials
 */
const createMaterial = async (req, res) => {
  try {
    const { name, category, unit, price, supplierId } = req.body;

    const newMaterial = {
      id: (mockMaterials.length + 1).toString(),
      name,
      category,
      unit,
      price,
      supplierId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockMaterials.push(newMaterial);

    res.status(201).json({
      success: true,
      data: { material: newMaterial },
      message: 'Material created successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Create material error:', error);
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
 * Update Material
 * PUT /api/v1/materials/:id
 */
const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, unit, price, supplierId, isActive } = req.body;
    
    const material = mockMaterials.find(m => m.id === id);
    
    if (!material) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MATERIAL_NOT_FOUND',
          message: 'Material not found',
          details: ['Material does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Update material data
    if (name) material.name = name;
    if (category) material.category = category;
    if (unit) material.unit = unit;
    if (price) material.price = price;
    if (supplierId) material.supplierId = supplierId;
    if (typeof isActive === 'boolean') material.isActive = isActive;
    material.updatedAt = new Date();

    res.status(200).json({
      success: true,
      data: { material },
      message: 'Material updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Update material error:', error);
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
 * Delete Material
 * DELETE /api/v1/materials/:id
 */
const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const materialIndex = mockMaterials.findIndex(m => m.id === id);
    
    if (materialIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'MATERIAL_NOT_FOUND',
          message: 'Material not found',
          details: ['Material does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    mockMaterials.splice(materialIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Delete material error:', error);
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
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial
}; 