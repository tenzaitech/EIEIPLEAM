const OdooService = require('./src/services/odoo.service');

/**
 * 🎯 TENZAI - Create Suppliers and Purchase Orders
 * สร้าง Supplier และ Purchase Order โดยอิงข้อมูลกับ Product ที่มีอยู่จริง
 */

class SupplierAndPOCreator {
  constructor() {
    this.odooService = new OdooService();
    this.isAuthenticated = false;
  }

  async authenticate() {
    try {
      console.log('🔐 Attempting to authenticate with Odoo...');
      const result = await this.odooService.authenticate();
      this.isAuthenticated = result.success;
      if (result.success) {
        console.log('✅ Authentication successful!');
      } else {
        console.log('❌ Authentication failed:', result.error);
      }
      return result;
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      this.isAuthenticated = false;
      return { success: false, error: error.message };
    }
  }

  // 🔍 ดึงข้อมูลสินค้าที่มีอยู่จริง
  async getExistingProducts() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      console.log('🔍 Fetching existing products...');
      const products = await this.odooService.search('product.template', [], [
        'id', 'name', 'default_code', 'list_price', 'standard_price', 'categ_id', 'type'
      ], 100);

      console.log(`📦 Found ${products.length} products`);
      return products;
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
      return [];
    }
  }

  // 🏢 สร้าง Supplier (Vendors)
  async createSuppliers() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    const suppliers = [
      {
        name: '🍣 Sushi Master Co., Ltd.',
        email: 'contact@sushimaster.co.th',
        phone: '+66-2-123-4567',
        street: '123 Sukhumvit Road',
        city: 'Bangkok',
        zip: '10110',
        country_id: 221, // Thailand
        is_company: true,
        supplier_rank: 10,
        customer_rank: 0,
        company_type: 'company'
      },
      {
        name: '🍜 Noodle World Import',
        email: 'sales@noodleworld.co.th',
        phone: '+66-2-234-5678',
        street: '456 Silom Road',
        city: 'Bangkok',
        zip: '10500',
        country_id: 221, // Thailand
        is_company: true,
        supplier_rank: 8,
        customer_rank: 0,
        company_type: 'company'
      },
      {
        name: '🥢 Japanese Kitchen Supplies',
        email: 'info@japanesekitchen.co.th',
        phone: '+66-2-345-6789',
        street: '789 Rama 4 Road',
        city: 'Bangkok',
        zip: '10500',
        country_id: 221, // Thailand
        is_company: true,
        supplier_rank: 9,
        customer_rank: 0,
        company_type: 'company'
      }
    ];

    const createdSuppliers = [];
    console.log('🏢 Creating suppliers...');

    for (const supplierData of suppliers) {
      try {
        console.log(`📝 Creating supplier: ${supplierData.name}`);
        const supplierId = await this.odooService.create('res.partner', supplierData);
        createdSuppliers.push({ id: supplierId, ...supplierData });
        console.log(`✅ Created supplier ID: ${supplierId}`);
      } catch (error) {
        console.error(`❌ Failed to create supplier ${supplierData.name}:`, error.message);
      }
    }

    return createdSuppliers;
  }

  // 📦 สร้าง Purchase Order
  async createPurchaseOrder(supplierId, orderLines, orderName) {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      console.log(`📦 Creating Purchase Order: ${orderName}`);
      
      const poData = {
        partner_id: supplierId,
        date_order: new Date().toISOString().split('T')[0],
        order_line: orderLines,
        notes: `TENZAI Restaurant - ${orderName}`,
        payment_term_id: false,
        date_planned: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      };

      const poId = await this.odooService.create('purchase.order', poData);
      console.log(`✅ Created Purchase Order ID: ${poId}`);
      
      return poId;
    } catch (error) {
      console.error(`❌ Failed to create Purchase Order:`, error.message);
      return null;
    }
  }

  // 🍣 สร้าง Purchase Order สำหรับ Sushi & Sashimi
  async createSushiPO(supplierId, products) {
    const sushiProducts = products.filter(p => 
      p.name.toLowerCase().includes('sushi') || 
      p.name.toLowerCase().includes('sashimi') ||
      p.name.toLowerCase().includes('salmon') ||
      p.name.toLowerCase().includes('tuna')
    ).slice(0, 5);

    if (sushiProducts.length === 0) {
      console.log('⚠️ No sushi products found, using first 3 products');
      sushiProducts.push(...products.slice(0, 3));
    }

    const orderLines = sushiProducts.map(product => [
      0, 0, {
        product_id: product.id,
        name: product.name,
        product_qty: Math.floor(Math.random() * 10) + 5, // 5-15 units
        price_unit: product.standard_price || product.list_price || 100,
        date_planned: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ]);

    return await this.createPurchaseOrder(supplierId, orderLines, 'Sushi & Sashimi Order');
  }

  // 🍜 สร้าง Purchase Order สำหรับ Noodles & Ramen
  async createNoodlePO(supplierId, products) {
    const noodleProducts = products.filter(p => 
      p.name.toLowerCase().includes('noodle') || 
      p.name.toLowerCase().includes('ramen') ||
      p.name.toLowerCase().includes('udon') ||
      p.name.toLowerCase().includes('soba')
    ).slice(0, 5);

    if (noodleProducts.length === 0) {
      console.log('⚠️ No noodle products found, using next 3 products');
      noodleProducts.push(...products.slice(3, 6));
    }

    const orderLines = noodleProducts.map(product => [
      0, 0, {
        product_id: product.id,
        name: product.name,
        product_qty: Math.floor(Math.random() * 20) + 10, // 10-30 units
        price_unit: product.standard_price || product.list_price || 50,
        date_planned: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ]);

    return await this.createPurchaseOrder(supplierId, orderLines, 'Noodles & Ramen Order');
  }

  // 🥢 สร้าง Purchase Order สำหรับ Kitchen Supplies
  async createKitchenSuppliesPO(supplierId, products) {
    const supplyProducts = products.filter(p => 
      p.name.toLowerCase().includes('chopstick') || 
      p.name.toLowerCase().includes('plate') ||
      p.name.toLowerCase().includes('bowl') ||
      p.name.toLowerCase().includes('sauce') ||
      p.name.toLowerCase().includes('tea')
    ).slice(0, 5);

    if (supplyProducts.length === 0) {
      console.log('⚠️ No kitchen supply products found, using last 3 products');
      supplyProducts.push(...products.slice(-3));
    }

    const orderLines = supplyProducts.map(product => [
      0, 0, {
        product_id: product.id,
        name: product.name,
        product_qty: Math.floor(Math.random() * 50) + 20, // 20-70 units
        price_unit: product.standard_price || product.list_price || 25,
        date_planned: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ]);

    return await this.createPurchaseOrder(supplierId, orderLines, 'Kitchen Supplies Order');
  }

  // 🚀 สร้างทั้งหมด
  async createAll() {
    console.log('🎯 TENZAI - Creating Suppliers and Purchase Orders');
    console.log('='.repeat(60));

    try {
      // 1. ดึงข้อมูลสินค้าที่มีอยู่
      const products = await this.getExistingProducts();
      if (products.length === 0) {
        console.log('❌ No products found. Please create products first.');
        return;
      }

      // 2. สร้าง Suppliers
      const suppliers = await this.createSuppliers();
      if (suppliers.length === 0) {
        console.log('❌ No suppliers created. Stopping.');
        return;
      }

      // 3. สร้าง Purchase Orders
      console.log('\n📦 Creating Purchase Orders...');
      const purchaseOrders = [];

      // PO 1: Sushi & Sashimi
      if (suppliers[0]) {
        const po1 = await this.createSushiPO(suppliers[0].id, products);
        if (po1) purchaseOrders.push({ id: po1, type: 'Sushi & Sashimi', supplier: suppliers[0].name });
      }

      // PO 2: Noodles & Ramen
      if (suppliers[1]) {
        const po2 = await this.createNoodlePO(suppliers[1].id, products);
        if (po2) purchaseOrders.push({ id: po2, type: 'Noodles & Ramen', supplier: suppliers[1].name });
      }

      // PO 3: Kitchen Supplies
      if (suppliers[2]) {
        const po3 = await this.createKitchenSuppliesPO(suppliers[2].id, products);
        if (po3) purchaseOrders.push({ id: po3, type: 'Kitchen Supplies', supplier: suppliers[2].name });
      }

      // 4. สรุปผล
      console.log('\n📊 Summary Report');
      console.log('='.repeat(60));
      console.log(`🏢 Suppliers Created: ${suppliers.length}`);
      suppliers.forEach((supplier, index) => {
        console.log(`   ${index + 1}. ${supplier.name} (ID: ${supplier.id})`);
      });

      console.log(`\n📦 Purchase Orders Created: ${purchaseOrders.length}`);
      purchaseOrders.forEach((po, index) => {
        console.log(`   ${index + 1}. ${po.type} - ${po.supplier} (ID: ${po.id})`);
      });

      return {
        suppliers,
        purchaseOrders,
        products: products.length
      };

    } catch (error) {
      console.error('❌ Error in createAll:', error.message);
      return null;
    }
  }
}

// Export
module.exports = SupplierAndPOCreator;

// Run if called directly
if (require.main === module) {
  const creator = new SupplierAndPOCreator();
  creator.createAll()
    .then(results => {
      if (results) {
        console.log('\n🎉 Successfully created suppliers and purchase orders!');
      } else {
        console.log('\n❌ Failed to create suppliers and purchase orders.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Script failed:', error.message);
      process.exit(1);
    });
} 