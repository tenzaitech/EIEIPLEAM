const OdooService = require('./src/services/odoo.service');

async function checkInstalledApps() {
  console.log('🔍 Checking installed apps in TENZAI Purchasing System...');
  console.log('='.repeat(70));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Get all installed modules
    console.log('\n📦 Fetching all installed modules...');
    const installedModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'installed']], 
      ['name', 'display_name', 'state', 'application'],
      500
    );

    console.log(`✅ Found ${installedModules.length} installed modules`);

    // Filter only application modules (not technical modules)
    const applicationModules = installedModules.filter(module => 
      module.application === true
    );

    console.log(`📱 Found ${applicationModules.length} application modules`);

    // Display all application modules
    console.log('\n📊 Installed Applications:');
    console.log('='.repeat(70));

    applicationModules.forEach((module, index) => {
      console.log(`${index + 1}. ${module.display_name} (${module.name})`);
    });

    // Check TENZAI required apps
    console.log('\n🎯 TENZAI Purchasing System Required Apps Status:');
    console.log('='.repeat(70));

    const tenzaiRequiredApps = [
      { name: 'purchase', displayName: 'Purchase Management', category: 'Core Business' },
      { name: 'account', displayName: 'Accounting', category: 'Core Business' },
      { name: 'contacts', displayName: 'Contact Management', category: 'Core Business' },
      { name: 'pos_restaurant', displayName: 'Restaurant Management', category: 'Restaurant' },
      { name: 'purchase_requisition', displayName: 'Purchase Requisition', category: 'Advanced Features' },
      { name: 'quality', displayName: 'Quality Management', category: 'Advanced Features' },
      { name: 'maintenance', displayName: 'Maintenance Management', category: 'Advanced Features' },
      { name: 'approvals', displayName: 'Approval Workflows', category: 'Workflow' },
      { name: 'documents', displayName: 'Document Management', category: 'Additional Features' },
      { name: 'helpdesk', displayName: 'Help Desk', category: 'Additional Features' },
      { name: 'crm', displayName: 'Customer Relationship Management', category: 'Sales' },
      { name: 'mrp', displayName: 'Manufacturing', category: 'Manufacturing' },
      { name: 'marketing_automation', displayName: 'Marketing Automation', category: 'Marketing' },
      { name: 'social', displayName: 'Social Marketing', category: 'Marketing' },
      { name: 'fleet', displayName: 'Fleet Management', category: 'Logistics' },
      { name: 'iot', displayName: 'Internet of Things', category: 'Technology' },
      { name: 'voip', displayName: 'VoIP Integration', category: 'Communication' },
      { name: 'whatsapp', displayName: 'WhatsApp Messaging', category: 'Communication' },
    ];

    const installedAppNames = installedModules.map(m => m.name);
    
    const installedTenzaiApps = tenzaiRequiredApps.filter(app => 
      installedAppNames.includes(app.name)
    );

    const missingTenzaiApps = tenzaiRequiredApps.filter(app => 
      !installedAppNames.includes(app.name)
    );

    console.log(`📊 Total TENZAI Required Apps: ${tenzaiRequiredApps.length}`);
    console.log(`✅ Installed: ${installedTenzaiApps.length}`);
    console.log(`❌ Missing: ${missingTenzaiApps.length}`);
    console.log(`📈 Installation Progress: ${Math.round((installedTenzaiApps.length / tenzaiRequiredApps.length) * 100)}%`);

    if (installedTenzaiApps.length > 0) {
      console.log('\n✅ Installed TENZAI Apps:');
      installedTenzaiApps.forEach(app => {
        console.log(`  - ${app.displayName} (${app.name}) - ${app.category}`);
      });
    }

    if (missingTenzaiApps.length > 0) {
      console.log('\n❌ Missing TENZAI Apps:');
      missingTenzaiApps.forEach(app => {
        console.log(`  - ${app.displayName} (${app.name}) - ${app.category}`);
      });
    }

    // Summary
    console.log('\n📋 Summary:');
    console.log('='.repeat(70));
    console.log(`📦 Total Installed Modules: ${installedModules.length}`);
    console.log(`📱 Total Application Modules: ${applicationModules.length}`);
    console.log(`🎯 TENZAI Required Apps Installed: ${installedTenzaiApps.length}/${tenzaiRequiredApps.length}`);
    
    if (installedTenzaiApps.length === tenzaiRequiredApps.length) {
      console.log('\n🎉 CONGRATULATIONS! All TENZAI required apps are installed!');
      console.log('🚀 TENZAI Purchasing System is ready for configuration!');
    } else {
      console.log('\n⚠️ Some TENZAI required apps are still missing.');
      console.log('💡 Consider running the installation scripts again or install manually.');
    }

    console.log('\n🔍 App check completed!');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('❌ App check failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Keep session active
    console.log('\n🔐 Session kept active for further operations');
  }
}

// Run the check
checkInstalledApps(); 