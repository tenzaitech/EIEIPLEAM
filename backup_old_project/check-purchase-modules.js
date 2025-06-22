const OdooService = require('./src/services/odoo.service');

async function checkPurchaseModules() {
  console.log('🔍 Checking available purchase-related modules...');
  console.log('='.repeat(70));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Check available modules for installation
    console.log('\n🔍 Checking available modules for installation...');
    const availableModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'uninstalled']], 
      ['name', 'display_name', 'state', 'application', 'id'],
      500
    );

    console.log(`📦 Found ${availableModules.length} available modules`);

    // Filter purchase-related modules
    const purchaseRelatedModules = availableModules.filter(module => 
      module.name.includes('purchase') || 
      module.name.includes('requisition') ||
      module.name.includes('procurement') ||
      module.name.includes('tender') ||
      module.display_name.toLowerCase().includes('purchase') ||
      module.display_name.toLowerCase().includes('requisition') ||
      module.display_name.toLowerCase().includes('procurement') ||
      module.display_name.toLowerCase().includes('tender')
    );

    console.log(`\n📋 Found ${purchaseRelatedModules.length} purchase-related modules:`);
    console.log('='.repeat(70));

    if (purchaseRelatedModules.length > 0) {
      purchaseRelatedModules.forEach((module, index) => {
        console.log(`${index + 1}. ${module.display_name} (${module.name}) - ID: ${module.id}`);
      });
    } else {
      console.log('❌ No purchase-related modules found');
    }

    // Check installed purchase modules
    console.log('\n🔍 Checking installed purchase modules...');
    const installedModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'installed']], 
      ['name', 'display_name', 'state'],
      500
    );

    const installedPurchaseModules = installedModules.filter(module => 
      module.name.includes('purchase') || 
      module.name.includes('requisition') ||
      module.name.includes('procurement') ||
      module.name.includes('tender') ||
      module.display_name.toLowerCase().includes('purchase') ||
      module.display_name.toLowerCase().includes('requisition') ||
      module.display_name.toLowerCase().includes('procurement') ||
      module.display_name.toLowerCase().includes('tender')
    );

    console.log(`\n✅ Found ${installedPurchaseModules.length} installed purchase modules:`);
    console.log('='.repeat(70));

    if (installedPurchaseModules.length > 0) {
      installedPurchaseModules.forEach((module, index) => {
        console.log(`${index + 1}. ${module.display_name} (${module.name})`);
      });
    } else {
      console.log('❌ No purchase modules are currently installed');
    }

    // Check for alternative requisition modules
    console.log('\n🔍 Checking for alternative requisition modules...');
    console.log('='.repeat(70));

    const alternativeModules = availableModules.filter(module => 
      module.name.includes('request') ||
      module.name.includes('approval') ||
      module.name.includes('workflow') ||
      module.display_name.toLowerCase().includes('request') ||
      module.display_name.toLowerCase().includes('approval') ||
      module.display_name.toLowerCase().includes('workflow')
    );

    console.log(`📋 Found ${alternativeModules.length} alternative workflow modules:`);
    
    if (alternativeModules.length > 0) {
      alternativeModules.forEach((module, index) => {
        console.log(`${index + 1}. ${module.display_name} (${module.name}) - ID: ${module.id}`);
      });
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log('='.repeat(70));
    console.log(`📦 Total Available Modules: ${availableModules.length}`);
    console.log(`🛒 Purchase-Related Available: ${purchaseRelatedModules.length}`);
    console.log(`✅ Purchase Modules Installed: ${installedPurchaseModules.length}`);
    console.log(`🔄 Alternative Workflow Modules: ${alternativeModules.length}`);

    if (purchaseRelatedModules.length === 0) {
      console.log('\n💡 Recommendations:');
      console.log('1. Purchase Requisition may be a paid module');
      console.log('2. Check Odoo App Store for purchase requisition modules');
      console.log('3. Consider using Approval Workflows as an alternative');
      console.log('4. Contact Odoo support for module availability');
    }

    console.log('\n🔍 Purchase modules check completed!');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('❌ Check failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Keep session active
    console.log('\n🔐 Session kept active for further operations');
  }
}

// Run the check
checkPurchaseModules(); 