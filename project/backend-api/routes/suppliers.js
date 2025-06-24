const express = require('express');
const router = express.Router();

// Mock suppliers data
let suppliers = [
  {
    id: 1,
    name: 'Supplier 1',
    email: 'supplier1@example.com',
    phone: '+1234567890',
    address: '123 Supplier St',
    created_at: new Date().toISOString()
  }
];

// Get all suppliers
router.get('/', (req, res) => {
  try {
    res.json({ success: true, data: suppliers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get supplier by ID
router.get('/:id', (req, res) => {
  try {
    const supplier = suppliers.find(s => s.id === parseInt(req.params.id));
    if (!supplier) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    res.json({ success: true, data: supplier });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create supplier
router.post('/', (req, res) => {
  try {
    const newSupplier = {
      id: suppliers.length + 1,
      ...req.body,
      created_at: new Date().toISOString()
    };
    suppliers.push(newSupplier);
    res.status(201).json({ success: true, data: newSupplier });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update supplier
router.put('/:id', (req, res) => {
  try {
    const index = suppliers.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    suppliers[index] = { ...suppliers[index], ...req.body };
    res.json({ success: true, data: suppliers[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete supplier
router.delete('/:id', (req, res) => {
  try {
    const index = suppliers.findIndex(s => s.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }
    suppliers.splice(index, 1);
    res.json({ success: true, message: 'Supplier deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 