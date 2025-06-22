#!/usr/bin/env node

/**
 * 🧪 TENZAI - Supabase Test Script
 * ทดสอบ CRUD operations และฟีเจอร์ต่างๆ
 */

const SupabaseService = require('./src/services/supabase.service');

class SupabaseTest {
  constructor() {
    this.supabase = new SupabaseService();
  }

  async runAllTests() {
    console.log('🧪 Starting TENZAI Supabase Tests...\n');

    // 1. Test Connection
    await this.testConnection();

    // 2. Test CRUD Operations
    await this.testCRUDOperations();

    // 3. Test Analytics
    await this.testAnalytics();

    // 4. Test Search & Filter
    await this.testSearchAndFilter();

    console.log('\n🎉 All tests completed!');
  }

  async testConnection() {
    console.log('1️⃣ Testing Connection...');
    const result = await this.supabase.testConnection();
    console.log(result.success ? '✅ Connection successful' : `❌ Connection failed: ${result.error}`);
    console.log('');
  }

  async testCRUDOperations() {
    console.log('2️⃣ Testing CRUD Operations...');

    // Test Product CRUD
    console.log('📦 Testing Product CRUD...');
    
    // Create
    const newProduct = {
      name: 'Test Product',
      code: 'TEST_001',
      description: 'Test product for CRUD testing',
      list_price: 25.99,
      cost_price: 15.00,
      type: 'consu',
      active: true
    };

    const createResult = await this.supabase.createProduct(newProduct);
    if (createResult.success) {
      console.log('✅ Product created:', createResult.data.id);
      
      // Read
      const readResult = await this.supabase.getProducts({ id: createResult.data.id });
      if (readResult.success && readResult.data.length > 0) {
        console.log('✅ Product read:', readResult.data[0].name);
        
        // Update
        const updateResult = await this.supabase.update('products', createResult.data.id, {
          name: 'Updated Test Product',
          list_price: 29.99
        });
        if (updateResult.success) {
          console.log('✅ Product updated');
          
          // Delete
          const deleteResult = await this.supabase.delete('products', createResult.data.id);
          if (deleteResult.success) {
            console.log('✅ Product deleted');
          } else {
            console.log('❌ Product delete failed:', deleteResult.error);
          }
        } else {
          console.log('❌ Product update failed:', updateResult.error);
        }
      } else {
        console.log('❌ Product read failed:', readResult.error);
      }
    } else {
      console.log('❌ Product create failed:', createResult.error);
    }

    // Test Supplier CRUD
    console.log('👥 Testing Supplier CRUD...');
    
    const newSupplier = {
      name: 'Test Supplier',
      email: 'test@supplier.com',
      phone: '+66-123-456-789',
      address: '123 Test Street',
      city: 'Bangkok',
      country: 'Thailand',
      zip_code: '10110',
      supplier_rank: 3,
      active: true
    };

    const supplierResult = await this.supabase.createSupplier(newSupplier);
    if (supplierResult.success) {
      console.log('✅ Supplier created:', supplierResult.data.id);
      
      // Clean up
      await this.supabase.delete('suppliers', supplierResult.data.id);
      console.log('✅ Supplier cleaned up');
    } else {
      console.log('❌ Supplier create failed:', supplierResult.error);
    }

    console.log('');
  }

  async testAnalytics() {
    console.log('3️⃣ Testing Analytics...');
    
    const analytics = await this.supabase.getAnalytics();
    if (analytics.success) {
      console.log('📊 Analytics Results:');
      console.log(`   👥 Suppliers: ${analytics.data.suppliers}`);
      console.log(`   📦 Products: ${analytics.data.products}`);
      console.log(`   📋 Purchase Orders: ${analytics.data.purchaseOrders}`);
      console.log(`   💰 Total PO Value: $${analytics.data.totalPOValue.toFixed(2)}`);
      console.log(`   ⏳ Pending POs: ${analytics.data.pendingPOs}`);
    } else {
      console.log('❌ Analytics failed:', analytics.error);
    }
    console.log('');
  }

  async testSearchAndFilter() {
    console.log('4️⃣ Testing Search & Filter...');

    // Test product search
    const products = await this.supabase.getProducts({ active: true }, ['id', 'name', 'list_price'], 5);
    if (products.success) {
      console.log(`✅ Found ${products.data.length} active products`);
      products.data.forEach(product => {
        console.log(`   - ${product.name}: $${product.list_price}`);
      });
    } else {
      console.log('❌ Product search failed:', products.error);
    }

    // Test supplier search
    const suppliers = await this.supabase.getSuppliers({ active: true }, ['id', 'name', 'email'], 5);
    if (suppliers.success) {
      console.log(`✅ Found ${suppliers.data.length} active suppliers`);
      suppliers.data.forEach(supplier => {
        console.log(`   - ${supplier.name}: ${supplier.email}`);
      });
    } else {
      console.log('❌ Supplier search failed:', suppliers.error);
    }

    console.log('');
  }
}

// 🚀 Run Tests
if (require.main === module) {
  const test = new SupabaseTest();
  test.runAllTests().catch(console.error);
}

module.exports = SupabaseTest; 