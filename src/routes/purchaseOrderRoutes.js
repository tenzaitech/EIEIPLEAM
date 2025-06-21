/**
 * 📋 Purchase Order Routes
 * Purchase order management endpoints for TENZAI Express.js Backend
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Purchase order management routes with CRUD operations
 */

const express = require('express');
const { body, query, param } = require('express-validator');
const { asyncHandler } = require('../middleware/errorHandler');
const { validateRequest } = require('../middleware/validationMiddleware');
const purchaseOrderController = require('../controllers/purchaseOrderController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// ========================================
// VALIDATION SCHEMAS
// ========================================
const createPurchaseOrderValidation = [
  body('supplierId')
    .isUUID()
    .withMessage('Invalid supplier ID format'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.materialId')
    .isUUID()
    .withMessage('Invalid material ID format'),
  body('items.*.quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be a positive number'),
  body('items.*.unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('expectedDeliveryDate')
    .optional()
    .isISO8601()
    .withMessage('Expected delivery date must be a valid date'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
];

const updatePurchaseOrderValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid purchase order ID format'),
  body('status')
    .optional()
    .isIn(['pending', 'approved', 'ordered', 'received', 'cancelled'])
    .withMessage('Invalid status'),
  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.materialId')
    .isUUID()
    .withMessage('Invalid material ID format'),
  body('items.*.quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be a positive number'),
  body('items.*.unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('expectedDeliveryDate')
    .optional()
    .isISO8601()
    .withMessage('Expected delivery date must be a valid date'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
];

const addItemValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid purchase order ID format'),
  body('materialId')
    .isUUID()
    .withMessage('Material ID must be a valid UUID'),
  body('quantity')
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be a positive number'),
  body('unitPrice')
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('currency')
    .optional()
    .isIn(['THB', 'USD', 'EUR', 'JPY'])
    .withMessage('Currency must be THB, USD, EUR, or JPY'),
  body('notes')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Notes must be between 5 and 200 characters'),
];

const updateItemValidation = [
  param('id')
    .isUUID()
    .withMessage('Invalid purchase order ID format'),
  param('itemId')
    .isUUID()
    .withMessage('Invalid item ID format'),
  body('quantity')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Quantity must be a positive number'),
  body('unitPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Unit price must be a positive number'),
  body('currency')
    .optional()
    .isIn(['THB', 'USD', 'EUR', 'JPY'])
    .withMessage('Currency must be THB, USD, EUR, or JPY'),
  body('notes')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Notes must be between 5 and 200 characters'),
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
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'ordered', 'received', 'cancelled'])
    .withMessage('Invalid status'),
  query('supplierId')
    .optional()
    .isUUID()
    .withMessage('Invalid supplier ID format'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'totalAmount', 'status'])
    .withMessage('Invalid sort field'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

// ========================================
// PURCHASE ORDER MANAGEMENT ROUTES
// ========================================

/**
 * @route   GET /api/v1/purchase-orders
 * @desc    Get all purchase orders with pagination and filtering
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/',
  authenticateToken,
  queryValidation,
  validateRequest,
  asyncHandler(purchaseOrderController.getAllPurchaseOrders)
);

/**
 * @route   GET /api/v1/purchase-orders/:id
 * @desc    Get purchase order by ID
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/:id',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.getPurchaseOrderById)
);

/**
 * @route   POST /api/v1/purchase-orders
 * @desc    Create a new purchase order
 * @access  Private (Admin, Manager)
 */
router.post(
  '/',
  authenticateToken,
  requireRole(['admin', 'manager']),
  createPurchaseOrderValidation,
  validateRequest,
  asyncHandler(purchaseOrderController.createPurchaseOrder)
);

/**
 * @route   PUT /api/v1/purchase-orders/:id
 * @desc    Update purchase order by ID
 * @access  Private (Admin, Manager)
 */
router.put(
  '/:id',
  authenticateToken,
  requireRole(['admin', 'manager']),
  updatePurchaseOrderValidation,
  validateRequest,
  asyncHandler(purchaseOrderController.updatePurchaseOrder)
);

/**
 * @route   DELETE /api/v1/purchase-orders/:id
 * @desc    Delete purchase order by ID (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.deletePurchaseOrder)
);

// ========================================
// PURCHASE ORDER STATUS MANAGEMENT
// ========================================

/**
 * @route   PATCH /api/v1/purchase-orders/:id/submit
 * @desc    Submit purchase order for approval
 * @access  Private (Admin, Manager)
 */
router.patch(
  '/:id/submit',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.submitPurchaseOrder)
);

/**
 * @route   PATCH /api/v1/purchase-orders/:id/approve
 * @desc    Approve purchase order
 * @access  Private (Admin)
 */
router.patch(
  '/:id/approve',
  authenticateToken,
  requireRole(['admin']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
    body('notes')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Notes must be between 5 and 200 characters'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.approvePurchaseOrder)
);

/**
 * @route   PATCH /api/v1/purchase-orders/:id/reject
 * @desc    Reject purchase order
 * @access  Private (Admin)
 */
router.patch(
  '/:id/reject',
  authenticateToken,
  requireRole(['admin']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
    body('reason')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Reason must be between 5 and 200 characters'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.rejectPurchaseOrder)
);

/**
 * @route   PATCH /api/v1/purchase-orders/:id/order
 * @desc    Mark purchase order as ordered
 * @access  Private (Admin, Manager)
 */
router.patch(
  '/:id/order',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
    body('orderNumber')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Order number must be between 2 and 50 characters'),
    body('orderDate')
      .optional()
      .isISO8601()
      .withMessage('Order date must be a valid date'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.markAsOrdered)
);

/**
 * @route   PATCH /api/v1/purchase-orders/:id/cancel
 * @desc    Cancel purchase order
 * @access  Private (Admin, Manager)
 */
router.patch(
  '/:id/cancel',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
    body('reason')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Reason must be between 5 and 200 characters'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.cancelPurchaseOrder)
);

// ========================================
// PURCHASE ORDER ITEMS MANAGEMENT
// ========================================

/**
 * @route   GET /api/v1/purchase-orders/:id/items
 * @desc    Get purchase order items
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/:id/items',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.getPurchaseOrderItems)
);

/**
 * @route   POST /api/v1/purchase-orders/:id/items
 * @desc    Add item to purchase order
 * @access  Private (Admin, Manager)
 */
router.post(
  '/:id/items',
  authenticateToken,
  requireRole(['admin', 'manager']),
  addItemValidation,
  validateRequest,
  asyncHandler(purchaseOrderController.addPurchaseOrderItem)
);

/**
 * @route   PUT /api/v1/purchase-orders/items/:itemId
 * @desc    Update purchase order item
 * @access  Private (Admin, Manager)
 */
router.put(
  '/items/:itemId',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('itemId')
      .isUUID()
      .withMessage('Invalid item ID format'),
    body('purchaseOrderId')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
    body('materialId')
      .optional()
      .isUUID()
      .withMessage('Invalid material ID format'),
    body('quantity')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Quantity must be a positive number'),
    body('unitPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Unit price must be a positive number'),
    body('totalPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Total price must be a positive number'),
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Notes must not exceed 500 characters'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.updateOrderItem)
);

/**
 * @route   DELETE /api/v1/purchase-orders/items/:itemId
 * @desc    Delete purchase order item
 * @access  Private (Admin, Manager)
 */
router.delete(
  '/items/:itemId',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('itemId')
      .isUUID()
      .withMessage('Invalid item ID format'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.deleteOrderItem)
);

// ========================================
// GOODS RECEIPT MANAGEMENT
// ========================================

/**
 * @route   POST /api/v1/purchase-orders/:id/receive
 * @desc    Receive goods for purchase order
 * @access  Private (Admin, Manager)
 */
router.post(
  '/:id/receive',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    param('id')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
    body('receivedItems')
      .isArray({ min: 1 })
      .withMessage('Received items must be an array with at least one item'),
    body('receivedItems.*.itemId')
      .isUUID()
      .withMessage('Item ID must be a valid UUID'),
    body('receivedItems.*.receivedQuantity')
      .isFloat({ min: 0.01 })
      .withMessage('Received quantity must be a positive number'),
    body('receivedItems.*.quality')
      .optional()
      .isIn(['excellent', 'good', 'fair', 'poor'])
      .withMessage('Quality must be excellent, good, fair, or poor'),
    body('receivedItems.*.notes')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Notes must be between 5 and 200 characters'),
    body('receivedDate')
      .isISO8601()
      .withMessage('Received date must be a valid date'),
    body('notes')
      .optional()
      .trim()
      .isLength({ min: 5, max: 500 })
      .withMessage('Notes must be between 5 and 500 characters'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.receiveGoods)
);

/**
 * @route   GET /api/v1/purchase-orders/:id/receipts
 * @desc    Get goods receipts for purchase order
 * @access  Private (Admin, Manager, User)
 */
router.get(
  '/:id/receipts',
  authenticateToken,
  [
    param('id')
      .isUUID()
      .withMessage('Invalid purchase order ID format'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.getGoodsReceipts)
);

// ========================================
// PURCHASE ORDER STATISTICS
// ========================================

/**
 * @route   GET /api/v1/purchase-orders/stats/overview
 * @desc    Get purchase order statistics overview
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/overview',
  authenticateToken,
  requireRole(['admin', 'manager']),
  asyncHandler(purchaseOrderController.getPurchaseOrderStats)
);

/**
 * @route   GET /api/v1/purchase-orders/stats/status
 * @desc    Get purchase order statistics by status
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/status',
  authenticateToken,
  requireRole(['admin', 'manager']),
  asyncHandler(purchaseOrderController.getPurchaseOrderStatusStats)
);

/**
 * @route   GET /api/v1/purchase-orders/stats/suppliers
 * @desc    Get purchase order statistics by supplier
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/suppliers',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    query('period')
      .optional()
      .isIn(['week', 'month', 'quarter', 'year'])
      .withMessage('Period must be week, month, quarter, or year'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.getPurchaseOrderSupplierStats)
);

/**
 * @route   GET /api/v1/purchase-orders/stats/trends
 * @desc    Get purchase order trends
 * @access  Private (Admin, Manager)
 */
router.get(
  '/stats/trends',
  authenticateToken,
  requireRole(['admin', 'manager']),
  [
    query('period')
      .optional()
      .isIn(['week', 'month', 'quarter', 'year'])
      .withMessage('Period must be week, month, quarter, or year'),
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
  asyncHandler(purchaseOrderController.getPurchaseOrderTrends)
);

// ========================================
// PURCHASE ORDER BULK OPERATIONS
// ========================================

/**
 * @route   POST /api/v1/purchase-orders/bulk/approve
 * @desc    Bulk approve purchase orders
 * @access  Private (Admin)
 */
router.post(
  '/bulk/approve',
  authenticateToken,
  requireRole(['admin']),
  [
    body('purchaseOrderIds')
      .isArray({ min: 1 })
      .withMessage('Purchase order IDs must be an array with at least one ID'),
    body('notes')
      .optional()
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Notes must be between 5 and 200 characters'),
  ],
  validateRequest,
  asyncHandler(purchaseOrderController.bulkApprovePurchaseOrders)
);

/**
 * @route   POST /api/v1/purchase-orders/bulk/export
 * @desc    Export purchase orders to CSV/Excel
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
  asyncHandler(purchaseOrderController.bulkExportPurchaseOrders)
);

// ========================================
// HEALTH CHECK ROUTE
// ========================================

/**
 * @route   GET /api/v1/purchase-orders/health
 * @desc    Purchase order service health check
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: 'Purchase Order Management Service',
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
    message: 'Purchase order service is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router; 