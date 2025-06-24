const express = require('express');
const xmlrpc = require('xmlrpc');
const router = express.Router();

// Odoo XML-RPC Client
class OdooClient {
  constructor() {
    this.url = process.env.ODOO_URL;
    this.db = process.env.ODOO_DB;
    this.username = process.env.ODOO_USERNAME;
    this.password = process.env.ODOO_PASSWORD;
    this.uid = null;
  }

  async authenticate() {
    return new Promise((resolve, reject) => {
      const client = xmlrpc.createClient({
        host: new URL(this.url).hostname,
        port: new URL(this.url).port || 80,
        path: '/xmlrpc/2/common'
      });

      client.methodCall('authenticate', [
        this.db,
        this.username,
        this.password,
        {}
      ], (error, value) => {
        if (error) {
          reject(error);
        } else {
          this.uid = value;
          resolve(value);
        }
      });
    });
  }

  async execute(model, method, params) {
    if (!this.uid) {
      await this.authenticate();
    }

    return new Promise((resolve, reject) => {
      const client = xmlrpc.createClient({
        host: new URL(this.url).hostname,
        port: new URL(this.url).port || 80,
        path: '/xmlrpc/2/object'
      });

      client.methodCall('execute_kw', [
        this.db,
        this.uid,
        this.password,
        model,
        method,
        params
      ], (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  }
}

const odooClient = new OdooClient();

// Get Odoo products
router.get('/products', async (req, res) => {
  try {
    const products = await odooClient.execute('product.product', 'search_read', [
      [['active', '=', true]],
      {
        fields: [
          'id', 'name', 'default_code', 'list_price', 'standard_price',
          'qty_available', 'type', 'categ_id', 'uom_id'
        ]
      }
    ]);

    res.json({ 
      success: true, 
      data: products,
      count: products.length 
    });
  } catch (error) {
    console.error('Odoo products error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Failed to fetch products from Odoo'
    });
  }
});

// Get Odoo suppliers (partners)
router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await odooClient.execute('res.partner', 'search_read', [
      [['supplier_rank', '>', 0], ['active', '=', true]],
      {
        fields: [
          'id', 'name', 'email', 'phone', 'street', 'city', 'country_id',
          'supplier_rank', 'payment_term_id'
        ]
      }
    ]);

    res.json({ 
      success: true, 
      data: suppliers,
      count: suppliers.length 
    });
  } catch (error) {
    console.error('Odoo suppliers error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Failed to fetch suppliers from Odoo'
    });
  }
});

// Get Odoo purchase orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await odooClient.execute('purchase.order', 'search_read', [
      [['state', 'in', ['purchase', 'done']]],
      {
        fields: [
          'id', 'name', 'partner_id', 'amount_total', 'state', 'date_order',
          'date_planned', 'user_id'
        ]
      }
    ]);

    res.json({ 
      success: true, 
      data: orders,
      count: orders.length 
    });
  } catch (error) {
    console.error('Odoo orders error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Failed to fetch orders from Odoo'
    });
  }
});

// Sync data with Odoo
router.post('/sync', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    let syncResult = {
      type,
      synced_at: new Date().toISOString(),
      records_synced: 0,
      status: 'success',
      details: []
    };

    switch (type) {
      case 'products':
        // Sync products to Odoo
        for (const product of data) {
          try {
            const result = await odooClient.execute('product.product', 'create', [[{
              name: product.name,
              default_code: product.code,
              list_price: product.list_price,
              standard_price: product.cost_price,
              type: product.type === 'raw_material' ? 'product' : 'service'
            }]]);
            syncResult.records_synced++;
            syncResult.details.push({ id: product.id, odoo_id: result });
          } catch (err) {
            syncResult.details.push({ id: product.id, error: err.message });
          }
        }
        break;

      case 'suppliers':
        // Sync suppliers to Odoo
        for (const supplier of data) {
          try {
            const result = await odooClient.execute('res.partner', 'create', [[{
              name: supplier.name,
              email: supplier.email,
              phone: supplier.phone,
              street: supplier.address,
              city: supplier.city,
              supplier_rank: supplier.supplier_rank === 'A' ? 3 : supplier.supplier_rank === 'B' ? 2 : 1
            }]]);
            syncResult.records_synced++;
            syncResult.details.push({ id: supplier.id, odoo_id: result });
          } catch (err) {
            syncResult.details.push({ id: supplier.id, error: err.message });
          }
        }
        break;

      default:
        throw new Error(`Unknown sync type: ${type}`);
    }
    
    res.json({ success: true, data: syncResult });
  } catch (error) {
    console.error('Odoo sync error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Failed to sync data with Odoo'
    });
  }
});

// Test Odoo connection
router.get('/test', async (req, res) => {
  try {
    const uid = await odooClient.authenticate();
    res.json({ 
      success: true, 
      message: 'Odoo connection successful',
      uid: uid,
      server_info: {
        url: process.env.ODOO_URL,
        database: process.env.ODOO_DB,
        user: process.env.ODOO_USERNAME
      }
    });
  } catch (error) {
    console.error('Odoo test connection error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Failed to connect to Odoo'
    });
  }
});

module.exports = router; 