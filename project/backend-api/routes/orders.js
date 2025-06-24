const express = require('express');
const router = express.Router();

// Mock orders data
let orders = [
  {
    id: 1,
    order_number: 'ORD-001',
    supplier_id: 1,
    total_amount: 1000,
    status: 'pending',
    created_at: new Date().toISOString()
  }
];

// Get all orders
router.get('/', (req, res) => {
  try {
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get order by ID
router.get('/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create order
router.post('/', (req, res) => {
  try {
    const newOrder = {
      id: orders.length + 1,
      order_number: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      ...req.body,
      created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update order
router.put('/:id', (req, res) => {
  try {
    const index = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    orders[index] = { ...orders[index], ...req.body };
    res.json({ success: true, data: orders[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete order
router.delete('/:id', (req, res) => {
  try {
    const index = orders.findIndex(o => o.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    orders.splice(index, 1);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 