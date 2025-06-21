/**
 * 🏢 Supplier Routes
 * Supplier management endpoints for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Supplier management routes with CRUD operations
 */

const express = require('express');
const { body, query, param } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateRequest } = require('../middleware/validationMiddleware');
const supplierController = require('../controllers/supplierController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// ========================================
// VALIDATION SCHEMAS
// ========================================
const createSupplierValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Supplier name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  body('contactPerson')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contact person name must be between 2 and 100 characters'),
  body('taxId')
    .optional()
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Tax ID must be between 10 and 20 characters'),
  body('category')
    .optional()
    .isIn(['food', 'beverage', 'equipment', 'cleaning', 'other'])
    .withMessage('Category must be food, beverage, equipment, cleaning, or other'),
  body('paymentTerms')
    .optional()
    .isInt({ min: 0, max: 365 })
    .withMessage('Payment terms must be between 0 and 365 days'),
];

const updateSupplierValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid supplier ID format'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Supplier name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('address')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be between 10 and 500 characters'),
  body('contactPerson')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contact person name must be between 2 and 100 characters'),
  body('taxId')
    .optional()
    .trim()
    .isLength({ min: 10, max: 20 })
    .withMessage('Tax ID must be between 10 and 20 characters'),
  body('category')
    .optional()
    .isIn(['food', 'beverage', 'equipment', 'cleaning', 'other'])
    .withMessage('Category must be food, beverage, equipment, cleaning, or other'),
  body('paymentTerms')
    .optional()
    .isInt({ min: 0, max: 365 })
    .withMessage('Payment terms must be between 0 and 365 days'),
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
    .isIn(['food', 'beverage', 'equipment', 'cleaning', 'other'])
    .withMessage('Category must be food, beverage, equipment, cleaning, or other'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
  query('sortBy')
    .optional()
    .isIn(['name', 'email', 'category', 'createdAt', 'updatedAt'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

// ========================================
// SUPPLIER MANAGEMENT ROUTES
// ========================================

/**
 * @route   GET /api/v1/suppliers
 * @desc    Get all suppliers with pagination and filtering
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/',
  authenticateToken,
  queryValidation,
  validateRequest,
  asyncHandler(supplierController.getAllSuppliers)
);

/**
 * @route   GET /api/v1/suppliers/:id
 * @desc    Get supplier by ID
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/:id',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
  ],
  validateRequest,
  asyncHandler(supplierController.getSupplierById)
);

/**
 * @route   POST /api/v1/suppliers
 * @desc    Create a new supplier
 * @access  Private (Admin, Manager)
 */
router.post(
  '/',
  authenticateToken,
  requireRole(['admin', 'manager']),
  createSupplierValidation,
  validateRequest,
  asyncHandler(supplierController.createSupplier)
);

/**
 * @route   PUT /api/v1/suppliers/:id
 * @desc    Update supplier by ID
 * @access  Private (Admin, Manager)
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole(['admin', 'manager']),
  updateSupplierValidation,
  validateRequest,
  asyncHandler(supplierController.updateSupplier)
);

/**
 * @route   DELETE /api/v1/suppliers/:id
 * @desc    Delete supplier by ID (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
  ],
  validateRequest,
  asyncHandler(supplierController.deleteSupplier)
);

/**
 * @route   PATCH /api/v1/suppliers/:id/activate
 * @desc    Activate supplier
 * @access  Private (Admin, Manager)
 */
router.patch(
  '/:id/activate',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
  ],
  validateRequest,
  asyncHandler(supplierController.activateSupplier)
);

/**
 * @route   PATCH /api/v1/suppliers/:id/deactivate
 * @desc    Deactivate supplier
 * @access  Private (Admin, Manager)
 */
router.patch(
  '/:id/deactivate',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
  ],
  validateRequest,
  asyncHandler(supplierController.deactivateSupplier)
);

// ========================================
// SUPPLIER CONTACT ROUTES
// ========================================

/**
 * @route   GET /api/v1/suppliers/:id/contacts
 * @desc    Get supplier contacts
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/:id/contacts',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
  ],
  validateRequest,
  asyncHandler(supplierController.getSupplierContacts)
);

/**
 * @route   POST /api/v1/suppliers/:id/contacts
 * @desc    Add supplier contact
 * @access  Private (Admin, Manager)
 */
router.post(
  '/:id/contacts',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Contact name must be between 2 and 100 characters'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('phone')
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('position')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Position must be between 2 and 100 characters'),
  ],
  validateRequest,
  asyncHandler(supplierController.addSupplierContact)
);

/**
 * @route   PUT /api/v1/suppliers/contacts/:contactId
 * @desc    Update supplier contact
 * @access  Private (Admin, Manager)
 */
router.put(
  '/contacts/:contactId',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('contactId')
      .isUUID()
      .withMessage('Invalid contact ID format'),
    body('supplierId')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Contact name must be between 2 and 100 characters'),
    body('email')
      .optional()
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('position')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Position must be between 2 and 100 characters'),
  ],
  validateRequest,
  asyncHandler(supplierController.updateSupplierContact)
);

/**
 * @route   DELETE /api/v1/suppliers/contacts/:contactId
 * @desc    Delete supplier contact
 * @access  Private (Admin, Manager)
 */
router.delete(
  '/contacts/:contactId',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('contactId')
      .isUUID()
      .withMessage('Invalid contact ID format'),
  ],
  validateRequest,
  asyncHandler(supplierController.deleteSupplierContact)
);

// ========================================
// SUPPLIER PRODUCTS ROUTES
// ========================================

/**
 * @route   GET /api/v1/suppliers/:id/products
 * @desc    Get supplier products
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/:id/products',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],
  validateRequest,
  asyncHandler(supplierController.getSupplierProducts)
);

/**
 * @route   POST /api/v1/suppliers/:id/products
 * @desc    Add product to supplier
 * @access  Private (Admin, Manager)
 */
router.post(
  '/:id/products',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
    body('productId')
      .isUUID()
      .withMessage('Invalid product ID format'),
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
  ],
  validateRequest,
  asyncHandler(supplierController.addSupplierProduct)
);

/**
 * @route   PUT /api/v1/suppliers/products/:productId
 * @desc    Update supplier product
 * @access  Private (Admin, Manager)
 */
router.put(
  '/products/:productId',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('productId')
      .isUUID()
      .withMessage('Invalid product ID format'),
    body('supplierId')
      .isUUID()
      .withMessage('Invalid supplier ID format'),
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
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean value'),
  ],
  validateRequest,
  asyncHandler(supplierController.updateSupplierProduct)
);

/**
 * @route   DELETE /api/v1/suppliers/products/:productId
 * @desc    Remove product from supplier
 * @access  Private (Admin, Manager)
 */
router.delete(
  '/products/:productId',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('productId')
      .isUUID()
      .withMessage('Invalid product ID format'),
  ],
  validateRequest,
  asyncHandler(supplierController.removeSupplierProduct)
);

// ========================================
// SUPPLIER STATISTICS ROUTES
// ========================================

/**
 * @route   GET /api/v1/suppliers/stats/overview
 * @desc    Get supplier statistics overview
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/overview',
  authenticateToken,
  requireRole(['admin', 'manager']),
  asyncHandler(supplierController.getSupplierStats)
);

/**
 * @route   GET /api/v1/suppliers/stats/categories
 * @desc    Get supplier statistics by category
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/categories',
  authenticateToken,
  requireRole(['admin', 'manager']),
  asyncHandler(supplierController.getSupplierCategoryStats)
);

/**
 * @route   GET /api/v1/suppliers/stats/performance
 * @desc    Get supplier performance statistics
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/performance',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    query('period')
      .optional()
      .isIn(['week', 'month', 'quarter', 'year'])
      .withMessage('Period must be week, month, quarter, or year'),
  ],
  validateRequest,
  asyncHandler(supplierController.getSupplierPerformanceStats)
);

// ========================================
// SUPPLIER BULK OPERATIONS
// ========================================

/**
 * @route   POST /api/v1/suppliers/bulk/import
 * @desc    Import suppliers from CSV/Excel
 * @access  Private (Admin)
 */
router.post(
  '/bulk/import',
  authenticateToken,
  requireRole(['admin']),
  asyncHandler(supplierController.bulkImportSuppliers)
);

/**
 * @route   POST /api/v1/suppliers/bulk/export
 * @desc    Export suppliers to CSV/Excel
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
  asyncHandler(supplierController.bulkExportSuppliers)
);

// ========================================
// HEALTH CHECK ROUTE
// ========================================

/**
 * @route   GET /api/v1/suppliers/health
 * @desc    Supplier service health check
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'Supplier Management Service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    message: 'Supplier service is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router; 