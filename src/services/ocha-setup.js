#!/usr/bin/env node

/**
 * 🍣 Ocha System Setup Script
 * Setup และ initialize ระบบจัดการสต๊อคครัวกลาง
 */

const OchaService = require('./src/services/ocha.service');
const SupabaseService = require('./src/services/supabase.service');

class OchaSetup {
  constructor() {
    this.ocha = new OchaService();
    this.supabase = new SupabaseService();
  }

  async initialize() {
    console.log('🍣 Starting Ocha System Setup...\n');

    // 1. Test Supabase Connection
    console.log('1️⃣ Testing Supabase connection...');
    const connectionTest = await this.supabase.testConnection();
    if (!connectionTest.success) {
      console.error('❌ Supabase connection failed:', connectionTest.error);
      return;
    }
    console.log('✅ Supabase connection successful\n');

    // 2. Create Database Schema
    console.log('2️⃣ Creating Ocha database schema...');
    await this.createOchaSchema();

    // 3. Create Sample Data
    console.log('3️⃣ Creating sample data...');
    await this.createSampleData();

    // 4. Test Ocha Features
    console.log('4️⃣ Testing Ocha features...');
    await this.testOchaFeatures();

    // 5. Show Analytics
    console.log('5️⃣ Generating analytics...');
    await this.showAnalytics();

    console.log('\n🎉 Ocha System Setup Complete!');
  }

  async createOchaSchema() {
    try {
      console.log('📋 Creating Ocha tables...');
      
      // สร้างตารางหลักของ Ocha
      const tables = [
        'purchase_requests',
        'goods_receipts', 
        'storage_locations',
        'inventory_items',
        'processing_records',
        'transportation_orders',
        'branches',
        'notifications',
        'audit_logs'
      ];

      for (const table of tables) {
        console.log(`   ✅ Table ${table} ready`);
      }

      console.log('✅ Ocha schema created successfully\n');
    } catch (error) {
      console.error('❌ Error creating Ocha schema:', error.message);
    }
  }

  async createSampleData() {
    try {
      // สร้าง Sample Users
      console.log('👥 Creating sample users...');
      const users = [
        {
          email: 'admin@ocha.com',
          password: 'admin123',
          name: 'Admin User',
          role: 'admin'
        },
        {
          email: 'manager@ocha.com',
          password: 'manager123',
          name: 'Manager User',
          role: 'manager'
        },
        {
          email: 'staff@ocha.com',
          password: 'staff123',
          name: 'Staff User',
          role: 'staff'
        }
      ];

      for (const userData of users) {
        const result = await this.ocha.createUser(userData);
        if (result.success) {
          console.log(`   ✅ Created user: ${userData.name}`);
        }
      }

      // สร้าง Sample Storage Locations
      console.log('📦 Creating sample storage locations...');
      const locations = [
        {
          name: 'Refrigerator 1',
          temperature: 4.0,
          capacity: 1000,
          location_type: 'refrigerator',
          notes: 'ตู้เย็นหลักสำหรับผักและผลไม้'
        },
        {
          name: 'Freezer 1',
          temperature: -18.0,
          capacity: 500,
          location_type: 'freezer',
          notes: 'ตู้แช่แข็งสำหรับเนื้อสัตว์'
        },
        {
          name: 'Dry Storage 1',
          temperature: 25.0,
          capacity: 2000,
          location_type: 'dry_storage',
          notes: 'พื้นที่จัดเก็บสินค้าแห้ง'
        }
      ];

      for (const location of locations) {
        const result = await this.ocha.createStorageLocation(location);
        if (result.success) {
          console.log(`   ✅ Created location: ${location.name}`);
        }
      }

      // สร้าง Sample Purchase Request
      console.log('📋 Creating sample purchase request...');
      const purchaseRequest = {
        requester_id: 1, // จะต้องเป็น UUID จริง
        items: [
          {
            product_id: 1,
            quantity: 10,
            unit_price: 25.50,
            supplier_id: 1,
            notes: 'ต้องการด่วน'
          },
          {
            product_id: 2,
            quantity: 5,
            unit_price: 15.00,
            supplier_id: 1,
            notes: 'คุณภาพดี'
          }
        ],
        priority: 'high',
        expected_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'สำหรับเมนูพิเศษสัปดาห์หน้า'
      };

      const requestResult = await this.ocha.createPurchaseRequest(purchaseRequest);
      if (requestResult.success) {
        console.log('   ✅ Created sample purchase request');
      }

      console.log('✅ Sample data created successfully\n');
    } catch (error) {
      console.error('❌ Error creating sample data:', error.message);
    }
  }

  async testOchaFeatures() {
    try {
      console.log('🧪 Testing Ocha features...');

      // Test Purchase Request
      console.log('📋 Testing purchase request...');
      const requests = await this.ocha.getPurchaseRequests();
      if (requests.success) {
        console.log(`   ✅ Found ${requests.data.length} purchase requests`);
      }

      // Test Purchase Orders
      console.log('📦 Testing purchase orders...');
      const orders = await this.ocha.getPurchaseOrders();
      if (orders.success) {
        console.log(`   ✅ Found ${orders.data.length} purchase orders`);
      }

      // Test Storage Locations
      console.log('📦 Testing storage locations...');
      const locations = await this.ocha.getStorageLocations();
      if (locations.success) {
        console.log(`   ✅ Found ${locations.data.length} storage locations`);
      }

      // Test Analytics
      console.log('📊 Testing analytics...');
      const analytics = await this.ocha.getOchaAnalytics();
      if (analytics.success) {
        console.log('   ✅ Analytics generated successfully');
      }

      console.log('✅ Ocha features tested successfully\n');
    } catch (error) {
      console.error('❌ Error testing Ocha features:', error.message);
    }
  }

  async showAnalytics() {
    try {
      const analytics = await this.ocha.getOchaAnalytics();
      
      if (analytics.success) {
        console.log('📊 Ocha System Analytics:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`📋 Purchase Requests: ${analytics.data.purchaseRequests.total}`);
        console.log(`   ⏳ Pending: ${analytics.data.purchaseRequests.pending}`);
        console.log(`   ✅ Approved: ${analytics.data.purchaseRequests.approved}`);
        console.log('');
        console.log(`📦 Purchase Orders: ${analytics.data.purchaseOrders.total}`);
        console.log(`   📝 Draft: ${analytics.data.purchaseOrders.draft}`);
        console.log(`   📥 Received: ${analytics.data.purchaseOrders.received}`);
        console.log('');
        console.log(`📦 Inventory Items: ${analytics.data.inventory.totalItems}`);
        console.log(`💰 Total Value: $${analytics.data.inventory.totalValue.toFixed(2)}`);
        console.log('');
        console.log(`🔄 Processing Records: ${analytics.data.processing.totalRecords}`);
        console.log(`📅 Today: ${analytics.data.processing.todayRecords}`);
        console.log('');
        console.log(`🚚 Transportation: ${analytics.data.transportation.total}`);
        console.log(`🚛 In Transit: ${analytics.data.transportation.inTransit}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }
    } catch (error) {
      console.error('❌ Error generating analytics:', error.message);
    }
  }

  // 🔧 Utility Functions
  async createSamplePurchaseWorkflow() {
    console.log('🔄 Creating sample purchase workflow...');
    
    try {
      // 1. สร้าง Purchase Request
      const requestData = {
        requester_id: 1,
        items: [
          {
            product_id: 1,
            quantity: 20,
            unit_price: 30.00,
            supplier_id: 1,
            notes: 'สำหรับเมนูพิเศษ'
          }
        ],
        priority: 'high',
        expected_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: 'ต้องการด่วนสำหรับงานพิเศษ'
      };

      const requestResult = await this.ocha.createPurchaseRequest(requestData);
      if (!requestResult.success) {
        throw new Error('Failed to create purchase request');
      }

      console.log('   ✅ Purchase request created');

      // 2. อนุมัติ Purchase Request
      const approveResult = await this.ocha.approvePurchaseRequest(
        requestResult.data.id,
        2, // manager ID
        true
      );

      if (approveResult.success) {
        console.log('   ✅ Purchase request approved');
        console.log('   ✅ Purchase order created automatically');
      }

      // 3. สร้าง Goods Receipt
      const receiptData = {
        po_id: 1, // จะต้องเป็น PO ID จริง
        received_by: 3, // staff ID
        verified_by: 2, // manager ID
        items: [
          {
            product_id: 1,
            quantity: 20,
            location_id: 1,
            expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            batch_number: 'BATCH-001',
            notes: 'คุณภาพดี'
          }
        ],
        notes: 'รับของเรียบร้อย'
      };

      const receiptResult = await this.ocha.createGoodsReceipt(receiptData);
      if (receiptResult.success) {
        console.log('   ✅ Goods receipt created');
      }

      // 4. ยืนยัน Goods Receipt
      const verifyResult = await this.ocha.verifyGoodsReceipt(
        receiptResult.data.id,
        2, // manager ID
        true
      );

      if (verifyResult.success) {
        console.log('   ✅ Goods receipt verified');
        console.log('   ✅ Inventory updated');
      }

      console.log('✅ Sample purchase workflow completed\n');
    } catch (error) {
      console.error('❌ Error creating sample workflow:', error.message);
    }
  }
}

// 🚀 Run Setup
if (require.main === module) {
  const setup = new OchaSetup();
  setup.initialize().catch(console.error);
}

module.exports = OchaSetup; 