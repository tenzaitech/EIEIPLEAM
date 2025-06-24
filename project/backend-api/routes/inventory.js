const express = require('express');
const router = express.Router();

// Mock inventory data
let inventory = [
  {
    id: 1,
    product_id: 1,
    quantity: 100,
    location: 'Warehouse A',
    min_quantity: 10,
    created_at: new Date().toISOString()
  }
];

// Get all inventory items
router.get('/', (req, res) => {
  try {
    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get inventory item by ID
router.get('/:id', (req, res) => {
  try {
    const item = inventory.find(i => i.id === parseInt(req.params.id));
    if (!item) {
      return res.status(404).json({ success: false, error: 'Inventory item not found' });
    }
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create inventory item
router.post('/', (req, res) => {
  try {
    const newItem = {
      id: inventory.length + 1,
      ...req.body,
      created_at: new Date().toISOString()
    };
    inventory.push(newItem);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update inventory item
router.put('/:id', (req, res) => {
  try {
    const index = inventory.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Inventory item not found' });
    }
    inventory[index] = { ...inventory[index], ...req.body };
    res.json({ success: true, data: inventory[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete inventory item
router.delete('/:id', (req, res) => {
  try {
    const index = inventory.findIndex(i => i.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Inventory item not found' });
    }
    inventory.splice(index, 1);
    res.json({ success: true, message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 