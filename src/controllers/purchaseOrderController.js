/**
 * 📋 Purchase Order Controller
 * Purchase order management controller
 * 
 * @author TENZAI Tech Team
 * @version 1.0.0
 * @description Controller for purchase order management operations
 */

const { logger } = require('../utils/logger');

// Mock purchase order data for testing
const mockPurchaseOrders = [
  {
    id: '1',
    orderNumber: 'PO-2025-001',
    supplierId: '1',
    status: 'pending',
    totalAmount: 2550.00,
    items: [
      {
        materialId: '1',
        quantity: 100,
        unitPrice: 25.50,
        totalPrice: 2550.00
      }
    ],
    createdBy: '1',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

/**
 * Get All Purchase Orders
 * GET /api/v1/purchase-orders
 */
const getAllPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = mockPurchaseOrders.map(po => ({
      id: po.id,
      orderNumber: po.orderNumber,
      supplierId: po.supplierId,
      status: po.status,
      totalAmount: po.totalAmount,
      items: po.items,
      createdBy: po.createdBy,
      createdAt: po.createdAt,
      updatedAt: po.updatedAt
    }));

    res.status(200).json({
      success: true,
      data: {
        purchaseOrders,
        total: purchaseOrders.length
      },
      message: 'Purchase orders retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get all purchase orders error:', error);
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
 * Get Purchase Order By ID
 * GET /api/v1/purchase-orders/:id
 */
const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseOrder = mockPurchaseOrders.find(po => po.id === id);
    
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PURCHASE_ORDER_NOT_FOUND',
          message: 'Purchase order not found',
          details: ['Purchase order does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      success: true,
      data: { purchaseOrder },
      message: 'Purchase order retrieved successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Get purchase order by ID error:', error);
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
 * Create Purchase Order
 * POST /api/v1/purchase-orders
 */
const createPurchaseOrder = async (req, res) => {
  try {
    const { supplierId, items } = req.body;

    // Generate order number
    const orderNumber = `PO-${new Date().getFullYear()}-${String(mockPurchaseOrders.length + 1).padStart(3, '0')}`;
    
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    const newPurchaseOrder = {
      id: (mockPurchaseOrders.length + 1).toString(),
      orderNumber,
      supplierId,
      status: 'pending',
      totalAmount,
      items,
      createdBy: req.user?.userId || '1',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockPurchaseOrders.push(newPurchaseOrder);

    res.status(201).json({
      success: true,
      data: { purchaseOrder: newPurchaseOrder },
      message: 'Purchase order created successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Create purchase order error:', error);
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
 * Update Purchase Order
 * PUT /api/v1/purchase-orders/:id
 */
const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, items } = req.body;
    
    const purchaseOrder = mockPurchaseOrders.find(po => po.id === id);
    
    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PURCHASE_ORDER_NOT_FOUND',
          message: 'Purchase order not found',
          details: ['Purchase order does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    // Update purchase order data
    if (status) purchaseOrder.status = status;
    if (items) {
      purchaseOrder.items = items;
      purchaseOrder.totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    }
    purchaseOrder.updatedAt = new Date();

    res.status(200).json({
      success: true,
      data: { purchaseOrder },
      message: 'Purchase order updated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Update purchase order error:', error);
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
 * Delete Purchase Order
 * DELETE /api/v1/purchase-orders/:id
 */
const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const purchaseOrderIndex = mockPurchaseOrders.findIndex(po => po.id === id);
    
    if (purchaseOrderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PURCHASE_ORDER_NOT_FOUND',
          message: 'Purchase order not found',
          details: ['Purchase order does not exist']
        },
        timestamp: new Date().toISOString()
      });
    }

    mockPurchaseOrders.splice(purchaseOrderIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Purchase order deleted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Delete purchase order error:', error);
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
  getAllPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder
}; 