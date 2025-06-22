#!/usr/bin/env node

/**
 * 🚀 TENZAI - Supabase Setup Script
 * Setup และ initialize Supabase database สำหรับ TENZAI Purchasing System
 */

const SupabaseService = require('./src/services/supabase.service');
const OdooService = require('./src/services/odoo.service');

class SupabaseSetup {
  constructor() {
    this.supabase = new SupabaseService();
    this.odoo = new OdooService();
  }

  // 🔧 Initialize Database
  async initialize() {
    console.log('🚀 Starting TENZAI Supabase Setup...\n');

    // 1. Test Supabase Connection
    console.log('1️⃣ Testing Supabase connection...');
    const connectionTest = await this.supabase.testConnection();
    if (!connectionTest.success) {
      console.error('❌ Supabase connection failed:', connectionTest.error);
      return;
    }
    console.log('✅ Supabase connection successful\n');

    // 2. Create Database Schema
    console.log('2️⃣ Creating database schema...');
    const schemaResult = await this.supabase.createSchema();
    if (!schemaResult.success) {
      console.error('❌ Schema creation failed:', schemaResult.error);
      return;
    }
    console.log('✅ Database schema created successfully\n');

    // 3. Sync Data from Odoo
    console.log('3️⃣ Syncing data from Odoo...');
    await this.syncFromOdoo();

    // 4. Create Sample Data
    console.log('4️⃣ Creating sample data...');
    await this.createSampleData();

    // 5. Final Analytics
    console.log('5️⃣ Generating analytics...');
    await this.showAnalytics();

    console.log('\n🎉 TENZAI Supabase Setup Complete!');
  }

  // 🔄 Sync Data from Odoo
  async syncFromOdoo() {
    try {
      console.log('📥 Attempting to sync data from Odoo...');
      
      // Skip Odoo sync for now - focus on Supabase setup
      console.log('⚠️ Odoo sync temporarily disabled - focusing on Supabase setup');
      console.log('📝 You can sync Odoo data later using the master toolkit');

    } catch (error) {
      console.error('❌ Error syncing from Odoo:', error.message);
    }
  }

  // 🍣 Create Sample Data
  async createSampleData() {
    try {
      // Create Japanese Restaurant Categories
      const categories = [
        { name: 'Sushi & Sashimi', description: 'Fresh sushi and sashimi items' },
        { name: 'Noodles', description: 'Various types of Japanese noodles' },
        { name: 'Rice Dishes', description: 'Rice-based dishes and bowls' },
        { name: 'Appetizers', description: 'Small plates and starters' },
        { name: 'Beverages', description: 'Drinks and beverages' },
        { name: 'Kitchen Equipment', description: 'Cooking equipment and tools' }
      ];

      console.log('📦 Creating sample categories...');
      for (const category of categories) {
        await this.supabase.insert('categories', category);
      }

      // Create Sample Products
      const products = [
        // Sushi & Sashimi
        { name: 'Salmon Sashimi', code: 'SALMON_SASH', description: 'Fresh salmon sashimi', list_price: 15.99, cost_price: 8.50, type: 'consu' },
        { name: 'Tuna Sashimi', code: 'TUNA_SASH', description: 'Fresh tuna sashimi', list_price: 18.99, cost_price: 10.00, type: 'consu' },
        { name: 'California Roll', code: 'CALI_ROLL', description: 'California roll with crab', list_price: 12.99, cost_price: 6.50, type: 'consu' },
        { name: 'Spicy Tuna Roll', code: 'SPICY_TUNA', description: 'Spicy tuna roll', list_price: 14.99, cost_price: 7.50, type: 'consu' },
        
        // Noodles
        { name: 'Ramen Noodles', code: 'RAMEN_NOODLE', description: 'Fresh ramen noodles', list_price: 8.99, cost_price: 4.00, type: 'consu' },
        { name: 'Udon Noodles', code: 'UDON_NOODLE', description: 'Thick udon noodles', list_price: 7.99, cost_price: 3.50, type: 'consu' },
        { name: 'Soba Noodles', code: 'SOBA_NOODLE', description: 'Buckwheat soba noodles', list_price: 9.99, cost_price: 4.50, type: 'consu' },
        
        // Rice
        { name: 'Sushi Rice', code: 'SUSHI_RICE', description: 'Premium sushi rice', list_price: 12.99, cost_price: 6.00, type: 'consu' },
        { name: 'Jasmine Rice', code: 'JASMINE_RICE', description: 'Fragrant jasmine rice', list_price: 10.99, cost_price: 5.00, type: 'consu' },
        
        // Equipment
        { name: 'Sushi Knife', code: 'SUSHI_KNIFE', description: 'Professional sushi knife', list_price: 89.99, cost_price: 45.00, type: 'product' },
        { name: 'Bamboo Mat', code: 'BAMBOO_MAT', description: 'Bamboo rolling mat', list_price: 12.99, cost_price: 6.50, type: 'product' },
        { name: 'Rice Cooker', code: 'RICE_COOKER', description: 'Commercial rice cooker', list_price: 199.99, cost_price: 120.00, type: 'product' }
      ];

      console.log('📦 Creating sample products...');
      for (const product of products) {
        await this.supabase.createProduct(product);
      }

      // Create Sample Suppliers
      const suppliers = [
        {
          name: 'Tokyo Seafood Co.',
          email: 'contact@tokyoseafood.com',
          phone: '+81-3-1234-5678',
          address: '123 Tsukiji Market, Tokyo, Japan',
          city: 'Tokyo',
          country: 'Japan',
          zip_code: '104-0045',
          supplier_rank: 5
        },
        {
          name: 'Osaka Rice Suppliers',
          email: 'info@osakarice.com',
          phone: '+81-6-8765-4321',
          address: '456 Dotonbori, Osaka, Japan',
          city: 'Osaka',
          country: 'Japan',
          zip_code: '542-0071',
          supplier_rank: 4
        },
        {
          name: 'Kyoto Equipment Ltd.',
          email: 'sales@kyotoequipment.com',
          phone: '+81-75-1111-2222',
          address: '789 Gion District, Kyoto, Japan',
          city: 'Kyoto',
          country: 'Japan',
          zip_code: '605-0001',
          supplier_rank: 3
        }
      ];

      console.log('📦 Creating sample suppliers...');
      for (const supplier of suppliers) {
        await this.supabase.createSupplier(supplier);
      }

      console.log('✅ Sample data created successfully');

    } catch (error) {
      console.error('❌ Error creating sample data:', error.message);
    }
  }

  // 📊 Show Analytics
  async showAnalytics() {
    try {
      const analytics = await this.supabase.getAnalytics();
      
      if (analytics.success) {
        console.log('\n📊 TENZAI System Analytics:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👥 Suppliers: ${analytics.data.suppliers}`);
        console.log(`📦 Products: ${analytics.data.products}`);
        console.log(`📋 Purchase Orders: ${analytics.data.purchaseOrders}`);
        console.log(`💰 Total PO Value: $${analytics.data.totalPOValue.toFixed(2)}`);
        console.log(`⏳ Pending POs: ${analytics.data.pendingPOs}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }
    } catch (error) {
      console.error('❌ Error generating analytics:', error.message);
    }
  }
}

// 🚀 Run Setup
if (require.main === module) {
  const setup = new SupabaseSetup();
  setup.initialize().catch(console.error);
}

module.exports = SupabaseSetup; 