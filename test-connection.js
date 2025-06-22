const OdooService = require('./src/services/odoo.service');

async function testOdooConnection() {
  console.log('🧪 Testing Odoo Connection...');
  console.log('='.repeat(50));

  const odooService = new OdooService();

  try {
    // Test authentication
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Test getting partners
    console.log('\n👥 Testing partners retrieval...');
    const partners = await odooService.getPartners([], ['id', 'name', 'email'], 5);
    console.log(`✅ Found ${partners.length} partners`);
    if (partners.length > 0) {
      console.log('📋 Sample partner:', partners[0]);
    }

    // Test getting products
    console.log('\n📦 Testing products retrieval...');
    const products = await odooService.getProducts([], ['id', 'name', 'list_price'], 5);
    console.log(`✅ Found ${products.length} products`);
    if (products.length > 0) {
      console.log('📋 Sample product:', products[0]);
    }

    // Test getting sales orders
    console.log('\n📋 Testing sales orders retrieval...');
    const salesOrders = await odooService.getSalesOrders([], ['id', 'name', 'amount_total'], 5);
    console.log(`✅ Found ${salesOrders.length} sales orders`);
    if (salesOrders.length > 0) {
      console.log('📋 Sample sales order:', salesOrders[0]);
    }

    console.log('\n🎉 All tests passed!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Cleanup
    await odooService.logout();
    process.exit(0);
  }
}

// Run the test
testOdooConnection(); 