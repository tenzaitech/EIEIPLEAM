/**
 * 📦 Material Routes
 * Material management endpoints for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Material management routes with CRUD operations
 */

const express = require('express');
const { body, query, param } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateRequest } = require('../middleware/validationMiddleware');
const materialController = require('../controllers/materialController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// ========================================
// VALIDATION SCHEMAS
// ========================================
const createMaterialValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Material name must be between 2 and 100 characters'),
  body('code')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Material code must be between 3 and 20 characters'),
  body('category')
    .isIn(['food', 'beverage', 'equipment', 'cleaning', 'packaging', 'other'])
    .withMessage('Category must be food, beverage, equipment, cleaning, packaging, or other'),
  body('unit')
    .isIn(['kg', 'g', 'l', 'ml', 'pcs', 'box', 'bottle', 'can', 'bag', 'other'])
    .withMessage('Unit must be kg, g, l, ml, pcs, box, bottle, can, bag, or other'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('minStock')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum stock must be a positive number'),
  body('maxStock')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum stock must be a positive number'),
  body('reorderPoint')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Reorder point must be a positive number'),
  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number'),
  body('currency')
    .optional()
    .isIn(['THB', 'USD', 'EUR', 'JPY'])
    .withMessage('Currency must be THB, USD, EUR, or JPY'),
];

const updateMaterialValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid material ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Material name must be between 2 and 100 characters'),
  body('code')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Material code must be between 3 and 20 characters'),
  body('category')
    .optional()
    .isIn(['food', 'beverage', 'equipment', 'cleaning', 'packaging', 'other'])
    .withMessage('Category must be food, beverage, equipment, cleaning, packaging, or other'),
  body('unit')
    .optional()
    .isIn(['kg', 'g', 'l', 'ml', 'pcs', 'box', 'bottle', 'can', 'bag', 'other'])
    .withMessage('Unit must be kg, g, l, ml, pcs, box, bottle, can, bag, or other'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),
  body('minStock')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum stock must be a positive number'),
  body('maxStock')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum stock must be a positive number'),
  body('reorderPoint')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Reorder point must be a positive number'),
  body('cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Cost must be a positive number'),
  body('currency')
    .optional()
    .isIn(['THB', 'USD', 'EUR', 'JPY'])
    .withMessage('Currency must be THB, USD, EUR, or JPY'),
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
  query('category')
    .optional()
    .isIn(['food', 'beverage', 'equipment', 'cleaning', 'packaging', 'other'])
    .withMessage('Category must be food, beverage, equipment, cleaning, packaging, or other'),
  query('unit')
    .optional()
    .isIn(['kg', 'g', 'l', 'ml', 'pcs', 'box', 'bottle', 'can', 'bag', 'other'])
    .withMessage('Unit must be kg, g, l, ml, pcs, box, bottle, can, bag, or other'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  query('lowStock')
    .optional()
    .isBoolean()
    .withMessage('lowStock must be a boolean value'),
  query('sortBy')
    .optional()
    .isIn(['name', 'code', 'category', 'stock', 'cost', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

// ========================================
// MATERIAL MANAGEMENT ROUTES
// ========================================

/**
 * @route   GET /api/v1/materials
 * @desc    Get all materials with pagination and filtering
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/',
  authenticateToken,
  queryValidation,
  validateRequest,
  asyncHandler(materialController.getAllMaterials)
);

/**
 * @route   GET /api/v1/materials/:id
 * @desc    Get material by ID
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/:id',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid material ID format'),
  ],
  validateRequest,
  asyncHandler(materialController.getMaterialById)
);

/**
 * @route   POST /api/v1/materials
 * @desc    Create a new material
 * @access  Private (Admin, Manager)
 */
router.post(
  '/',
  authenticateToken,
  requireRole(['admin', 'manager']),
  createMaterialValidation,
  validateRequest,
  asyncHandler(materialController.createMaterial)
);

/**
 * @route   PUT /api/v1/materials/:id
 * @desc    Update material by ID
 * @access  Private (Admin, Manager)
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole(['admin', 'manager']),
  updateMaterialValidation,
  validateRequest,
  asyncHandler(materialController.updateMaterial)
);

/**
 * @route   DELETE /api/v1/materials/:id
 * @desc    Delete material by ID (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid material ID format'),
  ],
  validateRequest,
  asyncHandler(materialController.deleteMaterial)
);

/**
 * @route   PATCH /api/v1/materials/:id/activate
 * @desc    Activate material
 * @access  Private (Admin, Manager)
 */
router.patch(
  '/:id/activate',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid material ID format'),
  ],
  validateRequest,
  asyncHandler(materialController.activateMaterial)
);

/**
 * @route   PATCH /api/v1/materials/:id/deactivate
 * @desc    Deactivate material
 * @access  Private (Admin, Manager)
 */
router.patch(
  '/:id/deactivate',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid material ID format'),
  ],
  validateRequest,
  asyncHandler(materialController.deactivateMaterial)
);

// ========================================
// STOCK MANAGEMENT ROUTES
// ========================================

/**
 * @route   GET /api/v1/materials/:id/stock
 * @desc    Get material stock information
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/:id/stock',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid material ID format'),
  ],
  validateRequest,
  asyncHandler(materialController.getMaterialStock)
);

/**
 * @route   POST /api/v1/materials/:id/stock/adjust
 * @desc    Adjust material stock
 * @access  Private (Admin, Manager)
 */
router.post(
  '/:id/stock/adjust',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid material ID format'),
    body('quantity')
      .isFloat()
      .withMessage('Quantity must be a number'),
    body('type')
      .isIn(['in', 'out', 'adjustment'])
      .withMessage('Type must be in, out, or adjustment'),
    body('reason')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Reason must be between 5 and 200 characters'),
    body('reference')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Reference must be between 2 and 100 characters'),
  ],
  validateRequest,
  asyncHandler(materialController.adjustMaterialStock)
);

/**
 * @route   GET /api/v1/materials/:id/stock/history
 * @desc    Get material stock history
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/:id/stock/history',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid material ID format'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('type')
      .optional()
      .isIn(['in', 'out', 'adjustment'])
      .withMessage('Type must be in, out, or adjustment'),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid date'),
  ],
  validateRequest,
  asyncHandler(materialController.getMaterialStockHistory)
);

// ========================================
// SUPPLIER RELATIONSHIP ROUTES
// ========================================

/**
 * @route   GET /api/v1/materials/:id/suppliers
 * @desc    Get material suppliers
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/:id/suppliers',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid material ID format'),
  ],
  validateRequest,
  asyncHandler(materialController.getMaterialSuppliers)
);

/**
 * @route   POST /api/v1/materials/:id/suppliers
 * @desc    Add supplier to material
 * @access  Private (Admin, Manager)
 */
router.post(
  '/:id/suppliers',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid material ID format'),
    body('supplierId')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
    body('supplierProductCode')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Supplier product code must be between 1 and 50 characters'),
    body('unitPrice')
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a positive number'),
    body('currency')
      .optional()
      .isIn(['THB', 'USD', 'EUR', 'JPY'])
      .withMessage('Currency must be THB, USD, EUR, or JPY'),
    body('leadTime')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Lead time must be a positive integer'),
    body('isPreferred')
      .optional()
      .isBoolean()
      .withMessage('isPreferred must be a boolean value'),
  ],
  validateRequest,
  asyncHandler(materialController.addMaterialSupplier)
);

/**
 * @route   PUT /api/v1/materials/suppliers/:supplierId
 * @desc    Update material supplier
 * @access  Private (Admin, Manager)
 */
router.put(
  '/suppliers/:supplierId',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('supplierId')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
    body('materialId')
      .isUUID()
      .withMessage('Invalid material ID format'),
    body('supplierProductCode')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Supplier product code must be between 1 and 50 characters'),
    body('unitPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a positive number'),
    body('currency')
      .optional()
      .isIn(['THB', 'USD', 'EUR', 'JPY'])
      .withMessage('Currency must be THB, USD, EUR, or JPY'),
    body('leadTime')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Lead time must be a positive integer'),
    body('isPreferred')
      .optional()
      .isBoolean()
      .withMessage('isPreferred must be a boolean value'),
  ],
  validateRequest,
  asyncHandler(materialController.updateMaterialSupplier)
);

/**
 * @route   DELETE /api/v1/materials/suppliers/:supplierId
 * @desc    Remove supplier from material
 * @access  Private (Admin, Manager)
 */
router.delete(
  '/suppliers/:supplierId',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('supplierId')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
  ],
  validateRequest,
  asyncHandler(materialController.removeMaterialSupplier)
);

// ========================================
// MATERIAL STATISTICS ROUTES
// ========================================

/**
 * @route   GET /api/v1/materials/stats/overview
 * @desc    Get material statistics overview
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/overview',
  authenticateToken,
  requireRole(['admin', 'manager']),
  asyncHandler(materialController.getMaterialStats)
);

/**
 * @route   GET /api/v1/materials/stats/categories
 * @desc    Get material statistics by category
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/categories',
  authenticateToken,
  requireRole(['admin', 'manager']),
  asyncHandler(materialController.getMaterialCategoryStats)
);

/**
 * @route   GET /api/v1/materials/stats/stock
 * @desc    Get material stock statistics
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/stock',
  authenticateToken,
  requireRole(['admin', 'manager']),
  asyncHandler(materialController.getMaterialStockStats)
);

/**
 * @route   GET /api/v1/materials/stats/low-stock
 * @desc    Get low stock materials
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/low-stock',
  authenticateToken,
  requireRole(['admin', 'manager']),
  asyncHandler(materialController.getLowStockMaterials)
);

// ========================================
// MATERIAL BULK OPERATIONS
// ========================================

/**
 * @route   POST /api/v1/materials/bulk/import
 * @desc    Import materials from CSV/Excel
 * @access  Private (Admin)
 */
router.post(
  '/bulk/import',
  authenticateToken,
  requireRole(['admin']),
  asyncHandler(materialController.bulkImportMaterials)
);

/**
 * @route   POST /api/v1/materials/bulk/export
 * @desc    Export materials to CSV/Excel
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
  asyncHandler(materialController.bulkExportMaterials)
);

/**
 * @route   PATCH /api/v1/materials/bulk/update-stock
 * @desc    Bulk update material stock
 * @access  Private (Admin, Manager)
 */
router.patch(
  '/bulk/update-stock',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    body('materials')
      .isArray({ min: 1 })
      .withMessage('Materials must be an array with at least one item'),
    body('materials.*.id')
      .isUUID()
      .withMessage('Material ID must be a valid UUID'),
    body('materials.*.quantity')
      .isFloat()
      .withMessage('Quantity must be a number'),
    body('materials.*.type')
      .isIn(['in', 'out', 'adjustment'])
      .withMessage('Type must be in, out, or adjustment'),
    body('reason')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Reason must be between 5 and 200 characters'),
  ],
  validateRequest,
  asyncHandler(materialController.bulkUpdateMaterialStock)
);

// ========================================
// HEALTH CHECK ROUTE
// ========================================

/**
 * @route   GET /api/v1/materials/health
 * @desc    Material service health check
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'Material Management Service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    message: 'Material service is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router; 