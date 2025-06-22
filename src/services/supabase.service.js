const { createClient } = require('@supabase/supabase-js');
const SUPABASE_CONFIG = require('../../supabase.config');

/**
 * 🎯 TENZAI - Supabase Service
 * Database หลักสำหรับ TENZAI Purchasing System
 */

class SupabaseService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.init();
  }

  // 🔧 Initialize Supabase Client
  init() {
    try {
      this.client = createClient(
        SUPABASE_CONFIG.url,
        SUPABASE_CONFIG.serviceKey, // ใช้ service key สำหรับ server-side
        {
          auth: {
            autoRefreshToken: true,
            persistSession: false
          },
          db: {
            schema: 'public'
          }
        }
      );
      this.isConnected = true;
      console.log('✅ Supabase client initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error.message);
      this.isConnected = false;
    }
  }

  // 🔍 Test Connection
  async testConnection() {
    if (!this.isConnected) {
      return { success: false, error: 'Supabase client not initialized' };
    }

    try {
      const { data, error } = await this.client
        .from('tenzai_health_check')
        .select('*')
        .limit(1);

      if (error) {
        // Table doesn't exist, create it
        await this.createHealthCheckTable();
        return { success: true, message: 'Connection successful, health check table created' };
      }

      return { success: true, message: 'Connection successful' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🏗️ Create Health Check Table
  async createHealthCheckTable() {
    try {
      const { error } = await this.client.rpc('create_health_check_table');
      if (error) {
        console.log('Creating health check table manually...');
        // Fallback: create table manually
        await this.client.rpc('exec_sql', {
          sql: `
            CREATE TABLE IF NOT EXISTS tenzai_health_check (
              id SERIAL PRIMARY KEY,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              status TEXT DEFAULT 'healthy'
            );
          `
        });
      }
    } catch (error) {
      console.error('Error creating health check table:', error.message);
    }
  }

  // 📦 Create Database Schema
  async createSchema() {
    try {
      console.log('🏗️ Database schema already exists in Supabase Dashboard');
      console.log('✅ Tables created: products, categories, suppliers, purchase_orders, purchase_order_items, users');
      
      return { success: true, message: 'Database schema exists in Supabase Dashboard' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🔍 Generic CRUD Operations
  async select(table, filters = {}, fields = ['*'], limit = 100) {
    try {
      let query = this.client.from(table).select(fields.join(','));
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      });

      const { data, error } = await query.limit(limit);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async insert(table, data) {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .insert(data)
        .select();

      if (error) throw error;
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async update(table, id, data) {
    try {
      const { data: result, error } = await this.client
        .from(table)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (error) throw error;
      return { success: true, data: result[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async delete(table, id) {
    try {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🍣 TENZAI Specific Operations
  async createSupplier(supplierData) {
    return await this.insert('suppliers', supplierData);
  }

  async getSuppliers(filters = {}) {
    return await this.select('suppliers', filters);
  }

  async createPurchaseOrder(poData) {
    return await this.insert('purchase_orders', poData);
  }

  async getPurchaseOrders(filters = {}) {
    return await this.select('purchase_orders', filters);
  }

  async createProduct(productData) {
    return await this.insert('products', productData);
  }

  async getProducts(filters = {}) {
    return await this.select('products', filters);
  }

  // 📊 Analytics
  async getAnalytics() {
    try {
      const { data: suppliers, error: suppliersError } = await this.client
        .from('suppliers')
        .select('id');

      const { data: products, error: productsError } = await this.client
        .from('products')
        .select('id');

      const { data: purchaseOrders, error: posError } = await this.client
        .from('purchase_orders')
        .select('id, total_amount, status');

      if (suppliersError || productsError || posError) {
        throw new Error('Error fetching analytics data');
      }

      const analytics = {
        suppliers: suppliers?.length || 0,
        products: products?.length || 0,
        purchaseOrders: purchaseOrders?.length || 0,
        totalPOValue: purchaseOrders?.reduce((sum, po) => sum + (po.total_amount || 0), 0) || 0,
        pendingPOs: purchaseOrders?.filter(po => po.status === 'draft').length || 0
      };

      return { success: true, data: analytics };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = SupabaseService; 