const { createClient } = require('@supabase/supabase-js');
const xmlrpc = require('xmlrpc');

class OdooSyncService {
  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Initialize Odoo client
    this.odooUrl = process.env.ODOO_URL;
    this.odooDb = process.env.ODOO_DB;
    this.odooUsername = process.env.ODOO_USERNAME;
    this.odooPassword = process.env.ODOO_PASSWORD;
    this.odooUid = null;
  }

  // Odoo Authentication
  async authenticateOdoo() {
    return new Promise((resolve, reject) => {
      const client = xmlrpc.createClient({
        host: new URL(this.odooUrl).hostname,
        port: new URL(this.odooUrl).port || 80,
        path: '/xmlrpc/2/common'
      });

      client.methodCall('authenticate', [
        this.odooDb,
        this.odooUsername,
        this.odooPassword,
        {}
      ], (error, value) => {
        if (error) {
          reject(error);
        } else {
          this.odooUid = value;
          resolve(value);
        }
      });
    });
  }

  // Execute Odoo methods
  async executeOdoo(model, method, params) {
    if (!this.odooUid) {
      await this.authenticateOdoo();
    }

    return new Promise((resolve, reject) => {
      const client = xmlrpc.createClient({
        host: new URL(this.odooUrl).hostname,
        port: new URL(this.odooUrl).port || 80,
        path: '/xmlrpc/2/object'
      });

      client.methodCall('execute_kw', [
        this.odooDb,
        this.odooUid,
        this.odooPassword,
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

  // Sync Products from Supabase to Odoo
  async syncProductsToOdoo() {
    try {
      // Get products from Supabase
      const { data: products, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('active', true);

      if (error) throw error;

      const syncResults = [];
      let syncedCount = 0;

      for (const product of products) {
        try {
          // Check if product already exists in Odoo
          const existingProducts = await this.executeOdoo('product.product', 'search_read', [
            [['default_code', '=', product.code]],
            { fields: ['id'] }
          ]);

          let odooId;
          if (existingProducts.length > 0) {
            // Update existing product
            odooId = await this.executeOdoo('product.product', 'write', [
              [existingProducts[0].id],
              {
                name: product.name,
                list_price: product.list_price,
                standard_price: product.cost_price,
                type: product.type === 'raw_material' ? 'product' : 'service'
              }
            ]);
            odooId = existingProducts[0].id;
          } else {
            // Create new product
            odooId = await this.executeOdoo('product.product', 'create', [[{
              name: product.name,
              default_code: product.code,
              list_price: product.list_price,
              standard_price: product.cost_price,
              type: product.type === 'raw_material' ? 'product' : 'service'
            }]]);
          }

          // Update Supabase with Odoo ID
          await this.supabase
            .from('products')
            .update({ odoo_id: odooId })
            .eq('id', product.id);

          syncedCount++;
          syncResults.push({
            id: product.id,
            name: product.name,
            odoo_id: odooId,
            status: 'success'
          });
        } catch (err) {
          syncResults.push({
            id: product.id,
            name: product.name,
            error: err.message,
            status: 'failed'
          });
        }
      }

      return {
        success: true,
        synced_count: syncedCount,
        total_count: products.length,
        results: syncResults
      };
    } catch (error) {
      throw new Error(`Product sync failed: ${error.message}`);
    }
  }

  // Sync Suppliers from Supabase to Odoo
  async syncSuppliersToOdoo() {
    try {
      // Get suppliers from Supabase
      const { data: suppliers, error } = await this.supabase
        .from('suppliers')
        .select('*')
        .eq('active', true);

      if (error) throw error;

      const syncResults = [];
      let syncedCount = 0;

      for (const supplier of suppliers) {
        try {
          // Check if supplier already exists in Odoo
          const existingSuppliers = await this.executeOdoo('res.partner', 'search_read', [
            [['name', '=', supplier.name]],
            { fields: ['id'] }
          ]);

          let odooId;
          if (existingSuppliers.length > 0) {
            // Update existing supplier
            odooId = await this.executeOdoo('res.partner', 'write', [
              [existingSuppliers[0].id],
              {
                email: supplier.email,
                phone: supplier.phone,
                street: supplier.address,
                city: supplier.city,
                supplier_rank: supplier.supplier_rank === 'A' ? 3 : supplier.supplier_rank === 'B' ? 2 : 1
              }
            ]);
            odooId = existingSuppliers[0].id;
          } else {
            // Create new supplier
            odooId = await this.executeOdoo('res.partner', 'create', [[{
              name: supplier.name,
              email: supplier.email,
              phone: supplier.phone,
              street: supplier.address,
              city: supplier.city,
              supplier_rank: supplier.supplier_rank === 'A' ? 3 : supplier.supplier_rank === 'B' ? 2 : 1
            }]]);
          }

          // Update Supabase with Odoo ID
          await this.supabase
            .from('suppliers')
            .update({ odoo_id: odooId })
            .eq('id', supplier.id);

          syncedCount++;
          syncResults.push({
            id: supplier.id,
            name: supplier.name,
            odoo_id: odooId,
            status: 'success'
          });
        } catch (err) {
          syncResults.push({
            id: supplier.id,
            name: supplier.name,
            error: err.message,
            status: 'failed'
          });
        }
      }

      return {
        success: true,
        synced_count: syncedCount,
        total_count: suppliers.length,
        results: syncResults
      };
    } catch (error) {
      throw new Error(`Supplier sync failed: ${error.message}`);
    }
  }

  // Sync Purchase Orders from Odoo to Supabase
  async syncPurchaseOrdersFromOdoo() {
    try {
      // Get purchase orders from Odoo
      const odooOrders = await this.executeOdoo('purchase.order', 'search_read', [
        [['state', 'in', ['purchase', 'done']]],
        {
          fields: [
            'id', 'name', 'partner_id', 'amount_total', 'state', 'date_order',
            'date_planned', 'user_id'
          ]
        }
      ]);

      const syncResults = [];
      let syncedCount = 0;

      for (const odooOrder of odooOrders) {
        try {
          // Check if order already exists in Supabase
          const { data: existingOrder } = await this.supabase
            .from('purchase_orders')
            .select('id')
            .eq('odoo_id', odooOrder.id)
            .single();

          if (!existingOrder) {
            // Create new order in Supabase
            const { data: newOrder, error } = await this.supabase
              .from('purchase_orders')
              .insert({
                po_number: odooOrder.name,
                odoo_id: odooOrder.id,
                supplier_id: odooOrder.partner_id[0], // Assuming partner_id is a tuple [id, name]
                order_date: odooOrder.date_order,
                expected_date: odooOrder.date_planned,
                status: odooOrder.state,
                total_amount: odooOrder.amount_total,
                created_by: odooOrder.user_id[0] // Assuming user_id is a tuple [id, name]
              })
              .select()
              .single();

            if (error) throw error;

            syncedCount++;
            syncResults.push({
              odoo_id: odooOrder.id,
              name: odooOrder.name,
              supabase_id: newOrder.id,
              status: 'created'
            });
          } else {
            syncResults.push({
              odoo_id: odooOrder.id,
              name: odooOrder.name,
              status: 'already_exists'
            });
          }
        } catch (err) {
          syncResults.push({
            odoo_id: odooOrder.id,
            name: odooOrder.name,
            error: err.message,
            status: 'failed'
          });
        }
      }

      return {
        success: true,
        synced_count: syncedCount,
        total_count: odooOrders.length,
        results: syncResults
      };
    } catch (error) {
      throw new Error(`Purchase order sync failed: ${error.message}`);
    }
  }

  // Test connections
  async testConnections() {
    const results = {
      supabase: false,
      odoo: false,
      details: {}
    };

    try {
      // Test Supabase connection
      const { data, error } = await this.supabase
        .from('products')
        .select('count')
        .limit(1);

      if (!error) {
        results.supabase = true;
        results.details.supabase = 'Connected successfully';
      } else {
        results.details.supabase = error.message;
      }
    } catch (error) {
      results.details.supabase = error.message;
    }

    try {
      // Test Odoo connection
      const uid = await this.authenticateOdoo();
      results.odoo = true;
      results.details.odoo = `Connected successfully (UID: ${uid})`;
    } catch (error) {
      results.details.odoo = error.message;
    }

    return results;
  }
}

module.exports = OdooSyncService; 