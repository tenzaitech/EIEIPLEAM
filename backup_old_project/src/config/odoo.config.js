const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../config.env') });

const odooConfig = {
  // Odoo Server Configuration
  url: process.env.ODOO_URL || 'https://tztech.odoo.com',
  database: process.env.ODOO_DATABASE || 'tenzaitech',
  username: process.env.ODOO_USERNAME || 'tenzaigroup.tech@gmail.com',
  password: process.env.ODOO_PASSWORD || 'Tenzai.5678.tZ.',
  apiKey: process.env.ODOO_API_KEY || '74d3f3c7141b16b5c7e8d44d0092668518400722',
  
  // API Endpoints
  endpoints: {
    xmlrpc: '/xmlrpc/2/object',
    jsonrpc: '/web/dataset/call_kw',
    auth: '/web/session/authenticate',
    logout: '/web/session/destroy'
  },
  
  // Default Models
  models: {
    res_partner: 'res.partner',
    res_users: 'res.users',
    sale_order: 'sale.order',
    purchase_order: 'purchase.order',
    product_template: 'product.template',
    account_move: 'account.move'
  },
  
  // Connection Settings
  timeout: 30000,
  retries: 3,
  retryDelay: 1000
};

module.exports = odooConfig; 