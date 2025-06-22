const SupabaseService = require('./supabase.service');

/**
 * 🍣 Ocha Service - Business Logic สำหรับระบบจัดการสต๊อคครัวกลาง
 */

class OchaService {
  constructor() {
    this.supabase = new SupabaseService();
  }

  // 🔐 Test Connection
  async testConnection() {
    try {
      const result = await this.supabase.testConnection();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🔐 Authentication & User Management
  async authenticateUser(email, password) {
    try {
      const { data, error } = await this.supabase.client.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createUser(userData) {
    const { email, password, name, role = 'staff' } = userData;
    
    try {
      const { data, error } = await this.supabase.client.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 📋 Purchase Request System
  async createPurchaseRequest(requestData) {
    const {
      requester_id,
      items,
      priority = 'normal',
      expected_date,
      notes = ''
    } = requestData;

    try {
      const request = {
        requester_id,
        items: JSON.stringify(items),
        priority,
        expected_date,
        notes,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const result = await this.supabase.insert('purchase_requests', request);
      
      if (result.success) {
        // ส่ง notification ไปยัง approvers
        await this.sendNotification('purchase_request_created', result.data.id);
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPurchaseRequests(filters = {}) {
    return await this.supabase.select('purchase_requests', filters, [
      'id', 'requester_id', 'items', 'priority', 'expected_date', 
      'notes', 'status', 'created_at', 'approved_at', 'approved_by'
    ]);
  }

  async updatePurchaseRequest(id, data) {
    return await this.supabase.update('purchase_requests', id, data);
  }

  async approvePurchaseRequest(id) {
    return await this.approvePurchaseRequest(id, 'system', true);
  }

  async rejectPurchaseRequest(id, reason) {
    return await this.supabase.update('purchase_requests', id, {
      status: 'rejected',
      rejection_reason: reason,
      rejected_at: new Date().toISOString()
    });
  }

  // 📦 Purchase Order System
  async createPurchaseOrderFromRequest(requestId) {
    try {
      // ดึงข้อมูล Purchase Request
      const request = await this.supabase.select('purchase_requests', { id: requestId });
      if (!request.success || !request.data.length) {
        throw new Error('Purchase request not found');
      }

      const requestData = request.data[0];
      const items = JSON.parse(requestData.items);

      // สร้าง Purchase Order
      const poData = {
        po_number: this.generatePONumber(),
        request_id: requestId,
        supplier_id: items[0]?.supplier_id || null,
        order_date: new Date().toISOString(),
        expected_date: requestData.expected_date,
        status: 'draft',
        total_amount: 0,
        notes: requestData.notes
      };

      const poResult = await this.supabase.insert('purchase_orders', poData);
      
      if (poResult.success) {
        // สร้าง Purchase Order Items
        for (const item of items) {
          await this.supabase.insert('purchase_order_items', {
            po_id: poResult.data.id,
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price || 0,
            notes: item.notes || ''
          });
        }

        // อัปเดต total_amount
        await this.updatePOTotalAmount(poResult.data.id);
      }

      return poResult;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPurchaseOrders(filters = {}) {
    return await this.supabase.select('purchase_orders', filters, [
      'id', 'po_number', 'request_id', 'supplier_id', 'order_date', 
      'expected_date', 'status', 'total_amount', 'notes', 'created_at'
    ]);
  }

  async updatePOTotalAmount(poId) {
    try {
      const items = await this.supabase.select('purchase_order_items', { po_id: poId });
      if (!items.success) return items;

      const totalAmount = items.data.reduce((sum, item) => {
        return sum + (item.quantity * item.unit_price);
      }, 0);

      return await this.supabase.update('purchase_orders', poId, { total_amount: totalAmount });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async updatePurchaseOrder(id, data) {
    return await this.supabase.update('purchase_orders', id, data);
  }

  async confirmPurchaseOrder(id) {
    return await this.supabase.update('purchase_orders', id, { 
      status: 'confirmed',
      confirmed_at: new Date().toISOString()
    });
  }

  // 📥 Goods Receipt System
  async createGoodsReceipt(receiptData) {
    const {
      po_id,
      received_by,
      verified_by,
      items,
      notes = ''
    } = receiptData;

    try {
      const receipt = {
        po_id,
        received_by,
        verified_by,
        items: JSON.stringify(items),
        notes,
        status: 'pending_verification',
        received_at: new Date().toISOString()
      };

      const result = await this.supabase.insert('goods_receipts', receipt);
      
      if (result.success) {
        // ส่ง notification ไปยัง verifiers
        await this.sendNotification('goods_receipt_created', result.data.id);
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async verifyGoodsReceipt(receiptId, verifiedBy, verified = true) {
    try {
      const updateData = {
        status: verified ? 'verified' : 'rejected',
        verified_by: verifiedBy,
        verified_at: new Date().toISOString()
      };

      const result = await this.supabase.update('goods_receipts', receiptId, updateData);
      
      if (result.success && verified) {
        // อัปเดต inventory
        await this.updateInventoryFromReceipt(receiptId);
      }

      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getGoodsReceipts(filters = {}) {
    return await this.supabase.select('goods_receipts', filters, [
      'id', 'po_id', 'received_by', 'verified_by', 'items', 
      'notes', 'status', 'received_at', 'verified_at'
    ]);
  }

  async updateGoodsReceipt(id, data) {
    return await this.supabase.update('goods_receipts', id, data);
  }

  async confirmGoodsReceipt(id) {
    return await this.supabase.update('goods_receipts', id, { 
      status: 'confirmed',
      confirmed_at: new Date().toISOString()
    });
  }

  // 🏪 Storage Management
  async createStorage(storageData) {
    return await this.supabase.insert('storage_locations', storageData);
  }

  async getStorages(filters = {}) {
    return await this.supabase.select('storage_locations', filters);
  }

  async updateStorage(id, data) {
    return await this.supabase.update('storage_locations', id, data);
  }

  async moveInventory(fromStorage, toStorage, productId, quantity) {
    try {
      // ลด inventory จาก storage ต้นทาง
      await this.supabase.update('inventory', { 
        storage_id: fromStorage, 
        product_id: productId 
      }, { 
        quantity: this.supabase.client.sql`quantity - ${quantity}` 
      });

      // เพิ่ม inventory ใน storage ปลายทาง
      await this.supabase.update('inventory', { 
        storage_id: toStorage, 
        product_id: productId 
      }, { 
        quantity: this.supabase.client.sql`quantity + ${quantity}` 
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🍳 Processing Management
  async createProcessing(processingData) {
    return await this.supabase.insert('processing_records', processingData);
  }

  async getProcessings(filters = {}) {
    return await this.supabase.select('processing_records', filters);
  }

  async updateProcessing(id, data) {
    return await this.supabase.update('processing_records', id, data);
  }

  async startProcessing(id) {
    return await this.supabase.update('processing_records', id, { 
      status: 'in_progress',
      started_at: new Date().toISOString()
    });
  }

  async completeProcessing(id) {
    return await this.supabase.update('processing_records', id, { 
      status: 'completed',
      completed_at: new Date().toISOString()
    });
  }

  // 🚚 Transportation Management
  async createTransportation(transportData) {
    return await this.supabase.insert('transportation_orders', transportData);
  }

  async getTransportations(filters = {}) {
    return await this.supabase.select('transportation_orders', filters);
  }

  async updateTransportation(id, data) {
    return await this.supabase.update('transportation_orders', id, data);
  }

  async startTransportation(id) {
    return await this.supabase.update('transportation_orders', id, { 
      status: 'in_transit',
      started_at: new Date().toISOString()
    });
  }

  async completeTransportation(id) {
    return await this.supabase.update('transportation_orders', id, { 
      status: 'delivered',
      delivered_at: new Date().toISOString()
    });
  }

  // 📊 Analytics & Reports
  async getAnalytics() {
    try {
      const [
        suppliers,
        products,
        purchaseOrders,
        goodsReceipts,
        storages,
        processings,
        transportations
      ] = await Promise.all([
        this.supabase.select('suppliers', {}, ['id']),
        this.supabase.select('products', {}, ['id']),
        this.supabase.select('purchase_orders', {}, ['id', 'total_amount', 'status']),
        this.supabase.select('goods_receipts', {}, ['id', 'status']),
        this.supabase.select('storage_locations', {}, ['id']),
        this.supabase.select('processing_records', {}, ['id', 'status']),
        this.supabase.select('transportation_orders', {}, ['id', 'status'])
      ]);

      const totalPOValue = purchaseOrders.success ? 
        purchaseOrders.data.reduce((sum, po) => sum + (po.total_amount || 0), 0) : 0;
      
      const pendingPOs = purchaseOrders.success ? 
        purchaseOrders.data.filter(po => po.status === 'draft').length : 0;

      return {
        success: true,
        data: {
          suppliers: suppliers.success ? suppliers.data.length : 0,
          products: products.success ? products.data.length : 0,
          purchaseOrders: purchaseOrders.success ? purchaseOrders.data.length : 0,
          goodsReceipts: goodsReceipts.success ? goodsReceipts.data.length : 0,
          storages: storages.success ? storages.data.length : 0,
          processings: processings.success ? processings.data.length : 0,
          transportations: transportations.success ? transportations.data.length : 0,
          totalPOValue,
          pendingPOs
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getInventoryReport() {
    try {
      const inventory = await this.supabase.select('inventory_items', {}, [
        'id', 'product_id', 'location_id', 'quantity', 'expiry_date', 'batch_number'
      ]);

      if (!inventory.success) return inventory;

      // ดึงข้อมูล products และ locations
      const productIds = [...new Set(inventory.data.map(item => item.product_id))];
      const locationIds = [...new Set(inventory.data.map(item => item.location_id))];

      const [products, locations] = await Promise.all([
        this.supabase.select('products', { id: { in: productIds } }, ['id', 'name', 'code']),
        this.supabase.select('storage_locations', { id: { in: locationIds } }, ['id', 'name'])
      ]);

      // สร้าง lookup maps
      const productMap = {};
      const locationMap = {};

      if (products.success) {
        products.data.forEach(product => {
          productMap[product.id] = product;
        });
      }

      if (locations.success) {
        locations.data.forEach(location => {
          locationMap[location.id] = location;
        });
      }

      // สร้างรายงาน
      const report = inventory.data.map(item => ({
        id: item.id,
        product: productMap[item.product_id] || { name: 'Unknown', code: 'N/A' },
        location: locationMap[item.location_id] || { name: 'Unknown' },
        quantity: item.quantity,
        expiry_date: item.expiry_date,
        batch_number: item.batch_number
      }));

      return { success: true, data: report };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getPurchaseReport() {
    try {
      const purchaseOrders = await this.supabase.select('purchase_orders', {}, [
        'id', 'po_number', 'supplier_id', 'order_date', 'expected_date', 
        'status', 'total_amount', 'created_at'
      ]);

      if (!purchaseOrders.success) return purchaseOrders;

      // ดึงข้อมูล suppliers
      const supplierIds = [...new Set(purchaseOrders.data.map(po => po.supplier_id).filter(Boolean))];
      const suppliers = await this.supabase.select('suppliers', { id: { in: supplierIds } }, ['id', 'name']);

      const supplierMap = {};
      if (suppliers.success) {
        suppliers.data.forEach(supplier => {
          supplierMap[supplier.id] = supplier;
        });
      }

      // สร้างรายงาน
      const report = purchaseOrders.data.map(po => ({
        id: po.id,
        po_number: po.po_number,
        supplier: supplierMap[po.supplier_id] || { name: 'Unknown' },
        order_date: po.order_date,
        expected_date: po.expected_date,
        status: po.status,
        total_amount: po.total_amount,
        created_at: po.created_at
      }));

      return { success: true, data: report };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async getProcessingReport() {
    try {
      const processings = await this.supabase.select('processing_records', {}, [
        'id', 'product_id', 'quantity', 'process_type', 'output_quantity', 
        'processed_by', 'status', 'processed_at', 'started_at', 'completed_at'
      ]);

      if (!processings.success) return processings;

      // ดึงข้อมูล products
      const productIds = [...new Set(processings.data.map(p => p.product_id).filter(Boolean))];
      const products = await this.supabase.select('products', { id: { in: productIds } }, ['id', 'name', 'code']);

      const productMap = {};
      if (products.success) {
        products.data.forEach(product => {
          productMap[product.id] = product;
        });
      }

      // สร้างรายงาน
      const report = processings.data.map(processing => ({
        id: processing.id,
        product: productMap[processing.product_id] || { name: 'Unknown', code: 'N/A' },
        quantity: processing.quantity,
        process_type: processing.process_type,
        output_quantity: processing.output_quantity,
        processed_by: processing.processed_by,
        status: processing.status,
        processed_at: processing.processed_at,
        started_at: processing.started_at,
        completed_at: processing.completed_at
      }));

      return { success: true, data: report };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 🔔 Notification System
  async sendNotification(type, referenceId, userId = null) {
    try {
      const notification = {
        type,
        reference_id: referenceId,
        user_id: userId,
        message: this.getNotificationMessage(type),
        read: false,
        created_at: new Date().toISOString()
      };

      return await this.supabase.insert('notifications', notification);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getNotificationMessage(type) {
    const messages = {
      purchase_request_created: 'มีใบขอซื้อใหม่รอการอนุมัติ',
      purchase_request_approved: 'ใบขอซื้อได้รับการอนุมัติแล้ว',
      purchase_order_created: 'ใบสั่งซื้อใหม่ถูกสร้างขึ้น',
      goods_received: 'สินค้าได้รับการรับเข้าแล้ว',
      inventory_low: 'สินค้าบางรายการมีจำนวนน้อย',
      processing_completed: 'การแปรรูปเสร็จสิ้นแล้ว',
      transportation_scheduled: 'มีการขนส่งใหม่ถูกจัดตาราง'
    };

    return messages[type] || 'มีข้อความใหม่';
  }

  // 🛠️ Utility Functions
  generatePONumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `PO-${year}${month}${day}-${random}`;
  }

  async updateInventoryFromReceipt(receiptId) {
    try {
      const receipt = await this.supabase.select('goods_receipts', { id: receiptId });
      if (!receipt.success || !receipt.data.length) {
        throw new Error('Goods receipt not found');
      }

      const receiptData = receipt.data[0];
      const items = JSON.parse(receiptData.items);

      for (const item of items) {
        // อัปเดตหรือสร้าง inventory item
        const existingItem = await this.supabase.select('inventory_items', {
          product_id: item.product_id,
          location_id: item.location_id
        });

        if (existingItem.success && existingItem.data.length > 0) {
          // อัปเดตจำนวนที่มีอยู่
          const currentItem = existingItem.data[0];
          await this.supabase.update('inventory_items', currentItem.id, {
            quantity: currentItem.quantity + item.quantity
          });
        } else {
          // สร้าง inventory item ใหม่
          await this.supabase.insert('inventory_items', {
            product_id: item.product_id,
            location_id: item.location_id,
            quantity: item.quantity,
            expiry_date: item.expiry_date,
            batch_number: item.batch_number || null
          });
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // 📦 Product Management
  async createProduct(productData) {
    return await this.supabase.createProduct(productData);
  }

  async getProducts(filters = {}) {
    return await this.supabase.getProducts(filters);
  }

  async updateProduct(id, data) {
    return await this.supabase.update('products', id, data);
  }

  async deleteProduct(id) {
    return await this.supabase.delete('products', id);
  }

  // 👥 Supplier Management
  async createSupplier(supplierData) {
    return await this.supabase.createSupplier(supplierData);
  }

  async getSuppliers(filters = {}) {
    return await this.supabase.getSuppliers(filters);
  }

  async updateSupplier(id, data) {
    return await this.supabase.update('suppliers', id, data);
  }

  async deleteSupplier(id) {
    return await this.supabase.delete('suppliers', id);
  }

  // 📦 Inventory Items Management
  async getInventoryItems(filters = {}) {
    return await this.supabase.select('inventory_items', filters, [
      'id', 'product_id', 'location_id', 'quantity', 'unit_price', 
      'expiry_date', 'batch_number', 'notes', 'created_at', 'updated_at'
    ]);
  }

  async createInventoryItem(itemData) {
    return await this.supabase.insert('inventory_items', itemData);
  }

  async updateInventoryItem(id, data) {
    return await this.supabase.update('inventory_items', id, data);
  }

  async deleteInventoryItem(id) {
    return await this.supabase.delete('inventory_items', id);
  }
}

module.exports = OchaService; 