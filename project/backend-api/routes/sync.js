const express = require('express');
const router = express.Router();
const OdooSyncService = require('../services/odoo-sync.service');

const syncService = new OdooSyncService();

// Test all connections
router.get('/test', async (req, res) => {
  try {
    const results = await syncService.testConnections();
    res.json({
      success: true,
      data: results,
      message: 'Connection test completed'
    });
  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to test connections'
    });
  }
});

// Sync products from Supabase to Odoo
router.post('/products', async (req, res) => {
  try {
    const result = await syncService.syncProductsToOdoo();
    res.json({
      success: true,
      data: result,
      message: `Synced ${result.synced_count} out of ${result.total_count} products`
    });
  } catch (error) {
    console.error('Product sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to sync products'
    });
  }
});

// Sync suppliers from Supabase to Odoo
router.post('/suppliers', async (req, res) => {
  try {
    const result = await syncService.syncSuppliersToOdoo();
    res.json({
      success: true,
      data: result,
      message: `Synced ${result.synced_count} out of ${result.total_count} suppliers`
    });
  } catch (error) {
    console.error('Supplier sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to sync suppliers'
    });
  }
});

// Sync purchase orders from Odoo to Supabase
router.post('/purchase-orders', async (req, res) => {
  try {
    const result = await syncService.syncPurchaseOrdersFromOdoo();
    res.json({
      success: true,
      data: result,
      message: `Synced ${result.synced_count} out of ${result.total_count} purchase orders`
    });
  } catch (error) {
    console.error('Purchase order sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to sync purchase orders'
    });
  }
});

// Full sync (all data types)
router.post('/full', async (req, res) => {
  try {
    const results = {
      products: null,
      suppliers: null,
      purchase_orders: null,
      timestamp: new Date().toISOString()
    };

    // Sync products
    try {
      results.products = await syncService.syncProductsToOdoo();
    } catch (error) {
      results.products = { error: error.message };
    }

    // Sync suppliers
    try {
      results.suppliers = await syncService.syncSuppliersToOdoo();
    } catch (error) {
      results.suppliers = { error: error.message };
    }

    // Sync purchase orders
    try {
      results.purchase_orders = await syncService.syncPurchaseOrdersFromOdoo();
    } catch (error) {
      results.purchase_orders = { error: error.message };
    }

    res.json({
      success: true,
      data: results,
      message: 'Full sync completed'
    });
  } catch (error) {
    console.error('Full sync error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to perform full sync'
    });
  }
});

// Get sync status and statistics
router.get('/status', async (req, res) => {
  try {
    const connections = await syncService.testConnections();
    
    // Get counts from Supabase
    const { data: productCount } = await syncService.supabase
      .from('products')
      .select('count')
      .eq('active', true);

    const { data: supplierCount } = await syncService.supabase
      .from('suppliers')
      .select('count')
      .eq('active', true);

    const { data: orderCount } = await syncService.supabase
      .from('purchase_orders')
      .select('count');

    res.json({
      success: true,
      data: {
        connections,
        statistics: {
          products: productCount?.length || 0,
          suppliers: supplierCount?.length || 0,
          purchase_orders: orderCount?.length || 0
        },
        last_sync: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to get sync status'
    });
  }
});

module.exports = router; 