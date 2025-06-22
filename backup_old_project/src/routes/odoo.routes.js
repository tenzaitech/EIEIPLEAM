const express = require('express');
const router = express.Router();
const OdooService = require('../services/odoo.service');

const odooService = new OdooService();

// Middleware to handle errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Test connection endpoint
router.get('/test', asyncHandler(async (req, res) => {
  try {
    const authResult = await odooService.authenticate();
    res.json({
      success: true,
      message: 'เชื่อมต่อ Odoo สำเร็จ',
      data: {
        uid: authResult.uid,
        database: odooService.config.database,
        url: odooService.config.url
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'เชื่อมต่อ Odoo ไม่สำเร็จ',
      error: error.message
    });
  }
}));

// Get partners (customers/vendors)
router.get('/partners', asyncHandler(async (req, res) => {
  const { limit = 100, fields, domain } = req.query;
  
  let searchFields = ['id', 'name', 'email', 'phone', 'is_company'];
  if (fields) {
    searchFields = fields.split(',');
  }

  let searchDomain = [];
  if (domain) {
    try {
      searchDomain = JSON.parse(domain);
    } catch (e) {
      // Use default domain if parsing fails
    }
  }

  const partners = await odooService.getPartners(searchDomain, searchFields, parseInt(limit));
  
  res.json({
    success: true,
    message: 'ดึงข้อมูล partners สำเร็จ',
    count: partners.length,
    data: partners
  });
}));

// Get partner by ID
router.get('/partners/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fields } = req.query;
  
  let searchFields = ['id', 'name', 'email', 'phone', 'is_company', 'street', 'city', 'country_id'];
  if (fields) {
    searchFields = fields.split(',');
  }

  const partner = await odooService.getById(odooService.config.models.res_partner, parseInt(id), searchFields);
  
  if (!partner) {
    return res.status(404).json({
      success: false,
      message: 'ไม่พบ partner ที่ระบุ'
    });
  }

  res.json({
    success: true,
    message: 'ดึงข้อมูล partner สำเร็จ',
    data: partner
  });
}));

// Create new partner
router.post('/partners', asyncHandler(async (req, res) => {
  const partnerData = req.body;
  
  if (!partnerData.name) {
    return res.status(400).json({
      success: false,
      message: 'ชื่อ partner เป็นข้อมูลที่จำเป็น'
    });
  }

  const newPartnerId = await odooService.create(odooService.config.models.res_partner, partnerData);
  const newPartner = await odooService.getById(odooService.config.models.res_partner, newPartnerId);
  
  res.status(201).json({
    success: true,
    message: 'สร้าง partner สำเร็จ',
    data: newPartner
  });
}));

// Update partner
router.put('/partners/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  await odooService.update(odooService.config.models.res_partner, parseInt(id), updateData);
  const updatedPartner = await odooService.getById(odooService.config.models.res_partner, parseInt(id));
  
  res.json({
    success: true,
    message: 'อัปเดต partner สำเร็จ',
    data: updatedPartner
  });
}));

// Get sales orders
router.get('/sales-orders', asyncHandler(async (req, res) => {
  const { limit = 100, fields, domain } = req.query;
  
  let searchFields = ['id', 'name', 'partner_id', 'amount_total', 'state', 'date_order'];
  if (fields) {
    searchFields = fields.split(',');
  }

  let searchDomain = [];
  if (domain) {
    try {
      searchDomain = JSON.parse(domain);
    } catch (e) {
      // Use default domain if parsing fails
    }
  }

  const salesOrders = await odooService.getSalesOrders(searchDomain, searchFields, parseInt(limit));
  
  res.json({
    success: true,
    message: 'ดึงข้อมูล sales orders สำเร็จ',
    count: salesOrders.length,
    data: salesOrders
  });
}));

// Get products
router.get('/products', asyncHandler(async (req, res) => {
  const { limit = 100, fields, domain } = req.query;
  
  let searchFields = ['id', 'name', 'list_price', 'default_code', 'type', 'categ_id'];
  if (fields) {
    searchFields = fields.split(',');
  }

  let searchDomain = [];
  if (domain) {
    try {
      searchDomain = JSON.parse(domain);
    } catch (e) {
      // Use default domain if parsing fails
    }
  }

  const products = await odooService.getProducts(searchDomain, searchFields, parseInt(limit));
  
  res.json({
    success: true,
    message: 'ดึงข้อมูล products สำเร็จ',
    count: products.length,
    data: products
  });
}));

// Generic search endpoint
router.post('/search', asyncHandler(async (req, res) => {
  const { model, domain = [], fields = [], limit = 100 } = req.body;
  
  if (!model) {
    return res.status(400).json({
      success: false,
      message: 'Model เป็นข้อมูลที่จำเป็น'
    });
  }

  const results = await odooService.search(model, domain, fields, parseInt(limit));
  
  res.json({
    success: true,
    message: `ค้นหา ${model} สำเร็จ`,
    count: results.length,
    data: results
  });
}));

// Generic create endpoint
router.post('/create', asyncHandler(async (req, res) => {
  const { model, data } = req.body;
  
  if (!model || !data) {
    return res.status(400).json({
      success: false,
      message: 'Model และ data เป็นข้อมูลที่จำเป็น'
    });
  }

  const newRecordId = await odooService.create(model, data);
  const newRecord = await odooService.getById(model, newRecordId);
  
  res.status(201).json({
    success: true,
    message: `สร้าง ${model} สำเร็จ`,
    data: newRecord
  });
}));

// Generic update endpoint
router.put('/update/:model/:id', asyncHandler(async (req, res) => {
  const { model, id } = req.params;
  const updateData = req.body;
  
  await odooService.update(model, parseInt(id), updateData);
  const updatedRecord = await odooService.getById(model, parseInt(id));
  
  res.json({
    success: true,
    message: `อัปเดต ${model} สำเร็จ`,
    data: updatedRecord
  });
}));

// Logout endpoint
router.post('/logout', asyncHandler(async (req, res) => {
  await odooService.logout();
  
  res.json({
    success: true,
    message: 'ออกจากระบบ Odoo สำเร็จ'
  });
}));

module.exports = router; 