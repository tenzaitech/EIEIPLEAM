const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: './config.env' });
const TenzaiMasterToolkit = require('./master-toolkit');

// Import routes
const odooRoutes = require('./src/routes/odoo.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Master Toolkit
const toolkit = new TenzaiMasterToolkit();

// API Routes
app.use('/api/odoo', odooRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TENZAI API is running' });
});

// Products API
app.get('/api/products', async (req, res) => {
  try {
    const products = await toolkit.getOchaProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const result = await toolkit.createOchaProduct(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const result = await toolkit.updateOchaProduct(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const result = await toolkit.deleteOchaProduct(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Suppliers API
app.get('/api/suppliers', async (req, res) => {
  try {
    const suppliers = await toolkit.getOchaSuppliers();
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/suppliers', async (req, res) => {
  try {
    const result = await toolkit.createOchaSupplier(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const result = await toolkit.updateOchaSupplier(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const result = await toolkit.deleteOchaSupplier(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase Requests API
app.get('/api/purchase-requests', async (req, res) => {
  try {
    const requests = await toolkit.getOchaPurchaseRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchase-requests', async (req, res) => {
  try {
    const result = await toolkit.createOchaPurchaseRequest(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/purchase-requests/:id', async (req, res) => {
  try {
    const result = await toolkit.updateOchaPurchaseRequest(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchase-requests/:id/approve', async (req, res) => {
  try {
    const result = await toolkit.approveOchaPurchaseRequest(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchase-requests/:id/reject', async (req, res) => {
  try {
    const result = await toolkit.rejectOchaPurchaseRequest(req.params.id, req.body.reason);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purchase Orders API
app.get('/api/purchase-orders', async (req, res) => {
  try {
    const orders = await toolkit.getOchaPurchaseOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchase-orders', async (req, res) => {
  try {
    const result = await toolkit.createOchaPurchaseOrder(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/purchase-orders/:id', async (req, res) => {
  try {
    const result = await toolkit.updateOchaPurchaseOrder(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/purchase-orders/:id/confirm', async (req, res) => {
  try {
    const result = await toolkit.confirmOchaPurchaseOrder(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Goods Receipts API
app.get('/api/goods-receipts', async (req, res) => {
  try {
    const receipts = await toolkit.getOchaGoodsReceipts();
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/goods-receipts', async (req, res) => {
  try {
    const result = await toolkit.createOchaGoodsReceipt(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/goods-receipts/:id/confirm', async (req, res) => {
  try {
    const result = await toolkit.confirmOchaGoodsReceipt(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics API
app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await toolkit.getOchaAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports/inventory', async (req, res) => {
  try {
    const report = await toolkit.getOchaInventoryReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports/purchase', async (req, res) => {
  try {
    const report = await toolkit.getOchaPurchaseReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reports/processing', async (req, res) => {
  try {
    const report = await toolkit.getOchaProcessingReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🎉 Odoo Express Connector API',
    version: '1.0.0',
    description: 'API สำหรับเชื่อมต่อกับระบบ Odoo ERP',
    endpoints: {
      health: '/health',
      odoo: {
        test: '/api/odoo/test',
        partners: '/api/odoo/partners',
        salesOrders: '/api/odoo/sales-orders',
        products: '/api/odoo/products',
        search: '/api/odoo/search',
        create: '/api/odoo/create',
        update: '/api/odoo/update/:model/:id',
        logout: '/api/odoo/logout'
      }
    },
    documentation: 'ดูเอกสารเพิ่มเติมได้ที่ /docs'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'ไม่พบ endpoint ที่ระบุ',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Server is running...');
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔗 Odoo Test: http://localhost:${PORT}/api/odoo/test`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Database: ${process.env.ODOO_DATABASE || 'tenzaitech'}`);
  console.log(`🔐 Odoo URL: ${process.env.ODOO_URL || 'https://tztech.odoo.com'}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app; 