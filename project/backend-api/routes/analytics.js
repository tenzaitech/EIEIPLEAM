const express = require('express');
const router = express.Router();

// Mock analytics data
const dashboardData = {
  totalProducts: 150,
  totalSuppliers: 25,
  totalOrders: 75,
  totalValue: 125000,
  lowStockItems: 8,
  pendingOrders: 12,
  monthlyRevenue: [
    { month: 'Jan', revenue: 15000 },
    { month: 'Feb', revenue: 18000 },
    { month: 'Mar', revenue: 22000 },
    { month: 'Apr', revenue: 19000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 28000 }
  ]
};

const reportsData = {
  topProducts: [
    { name: 'Product A', sales: 150, revenue: 15000 },
    { name: 'Product B', sales: 120, revenue: 12000 },
    { name: 'Product C', sales: 100, revenue: 10000 }
  ],
  topSuppliers: [
    { name: 'Supplier A', orders: 25, value: 25000 },
    { name: 'Supplier B', orders: 20, value: 20000 },
    { name: 'Supplier C', orders: 15, value: 15000 }
  ]
};

// Get dashboard data
router.get('/dashboard', (req, res) => {
  try {
    res.json({ success: true, data: dashboardData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get reports
router.get('/reports', (req, res) => {
  try {
    const { type } = req.query;
    
    if (type === 'products') {
      res.json({ success: true, data: reportsData.topProducts });
    } else if (type === 'suppliers') {
      res.json({ success: true, data: reportsData.topSuppliers });
    } else {
      res.json({ success: true, data: reportsData });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get chart data
router.get('/charts/:type', (req, res) => {
  try {
    const { type } = req.params;
    
    if (type === 'revenue') {
      res.json({ success: true, data: dashboardData.monthlyRevenue });
    } else if (type === 'products') {
      res.json({ success: true, data: reportsData.topProducts });
    } else if (type === 'suppliers') {
      res.json({ success: true, data: reportsData.topSuppliers });
    } else {
      res.status(404).json({ success: false, error: 'Chart type not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 