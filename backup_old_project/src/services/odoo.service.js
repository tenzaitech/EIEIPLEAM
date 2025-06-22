const axios = require('axios');
const odooConfig = require('../config/odoo.config');

class OdooService {
  constructor() {
    this.config = odooConfig;
    this.sessionId = null;
    this.uid = null;
    this.axiosInstance = axios.create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Authenticate with Odoo using JSON-RPC
   */
  async authenticate() {
    try {
      console.log('🔐 Attempting to authenticate with Odoo...');
      console.log(`📍 URL: ${this.config.url}`);
      console.log(`📊 Database: ${this.config.database}`);
      console.log(`👤 Username: ${this.config.username}`);

      // First, get session info
      const sessionResponse = await this.axiosInstance.get('/web/session/get_session_info');
      console.log('📡 Session info:', sessionResponse.data);

      // Authenticate using JSON-RPC
      const authData = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          db: this.config.database,
          login: this.config.username,
          password: this.config.password
        }
      };

      console.log('🔄 Authenticating...');
      const response = await this.axiosInstance.post('/web/session/authenticate', authData);
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);
      console.log('📡 Response data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.result && response.data.result.uid) {
        this.uid = response.data.result.uid;
        
        // Extract session cookie
        const cookies = response.headers['set-cookie'];
        if (cookies && cookies.length > 0) {
          this.sessionId = cookies[0].split(';')[0];
          this.axiosInstance.defaults.headers.Cookie = this.sessionId;
          console.log('🍪 Session cookie set:', this.sessionId);
        }
        
        console.log('✅ Authentication successful');
        return {
          success: true,
          uid: this.uid,
          sessionId: this.sessionId,
          method: 'jsonrpc'
        };
      } else {
        throw new Error('Authentication failed: No valid response');
      }
    } catch (error) {
      console.error('❌ Authentication error:', error.message);
      if (error.response) {
        console.error('❌ Response status:', error.response.status);
        console.error('❌ Response headers:', error.response.headers);
        console.error('❌ Response data:', error.response.data);
      }
      throw error;
    }
  }

  /**
   * Execute Odoo method using JSON-RPC
   */
  async executeMethod(model, method, params = []) {
    try {
      if (!this.uid) {
        await this.authenticate();
      }

      const requestData = {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model: model,
          method: method,
          args: params,
          kwargs: {}
        }
      };

      console.log(`🔧 Executing ${method} on ${model}...`);
      const response = await this.axiosInstance.post('/web/dataset/call_kw', requestData);
      
      if (response.data.error) {
        throw new Error(`Odoo API Error: ${response.data.error.data.message}`);
      }

      return response.data.result;
    } catch (error) {
      console.error(`❌ Error executing method ${method} on ${model}:`, error.message);
      throw error;
    }
  }

  /**
   * Search records
   */
  async search(model, domain = [], fields = [], limit = 100) {
    try {
      console.log(`🔍 Searching ${model}...`);
      const result = await this.executeMethod(model, 'search_read', [domain, fields, 0, limit]);
      console.log(`✅ Found ${result.length} records`);
      return result;
    } catch (error) {
      console.error(`❌ Error searching ${model}:`, error.message);
      throw error;
    }
  }

  /**
   * Create new record
   */
  async create(model, data) {
    try {
      console.log(`➕ Creating ${model}...`);
      const result = await this.executeMethod(model, 'create', [data]);
      console.log(`✅ Created with ID: ${result}`);
      return result;
    } catch (error) {
      console.error(`❌ Error creating ${model}:`, error.message);
      throw error;
    }
  }

  /**
   * Update record
   */
  async update(model, id, data) {
    try {
      console.log(`✏️ Updating ${model} ID: ${id}...`);
      const result = await this.executeMethod(model, 'write', [[id], data]);
      console.log(`✅ Updated successfully`);
      return result;
    } catch (error) {
      console.error(`❌ Error updating ${model}:`, error.message);
      throw error;
    }
  }

  /**
   * Delete record
   */
  async delete(model, id) {
    try {
      console.log(`🗑️ Deleting ${model} ID: ${id}...`);
      const result = await this.executeMethod(model, 'unlink', [[id]]);
      console.log(`✅ Deleted successfully`);
      return result;
    } catch (error) {
      console.error(`❌ Error deleting ${model}:`, error.message);
      throw error;
    }
  }

  /**
   * Get record by ID
   */
  async getById(model, id, fields = []) {
    try {
      console.log(`📋 Getting ${model} ID: ${id}...`);
      const result = await this.executeMethod(model, 'read', [[id], fields]);
      const record = result[0] || null;
      console.log(`✅ Record found: ${record ? 'Yes' : 'No'}`);
      return record;
    } catch (error) {
      console.error(`❌ Error getting ${model} by ID:`, error.message);
      throw error;
    }
  }

  /**
   * Get partners (customers/vendors)
   */
  async getPartners(domain = [], fields = ['id', 'name', 'email', 'phone'], limit = 100) {
    return await this.search(this.config.models.res_partner, domain, fields, limit);
  }

  /**
   * Get sales orders
   */
  async getSalesOrders(domain = [], fields = ['id', 'name', 'partner_id', 'amount_total', 'state'], limit = 100) {
    return await this.search(this.config.models.sale_order, domain, fields, limit);
  }

  /**
   * Get products
   */
  async getProducts(domain = [], fields = ['id', 'name', 'list_price', 'default_code'], limit = 100) {
    return await this.search(this.config.models.product_template, domain, fields, limit);
  }

  /**
   * Logout from Odoo
   */
  async logout() {
    try {
      if (this.sessionId) {
        console.log('🚪 Logging out...');
        await this.axiosInstance.post('/web/session/destroy');
      }
      this.sessionId = null;
      this.uid = null;
      console.log('✅ Successfully logged out from Odoo');
    } catch (error) {
      console.error('❌ Logout error:', error.message);
    }
  }
}

module.exports = OdooService; 