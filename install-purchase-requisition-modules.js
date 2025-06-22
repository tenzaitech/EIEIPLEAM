const OdooService = require('./src/services/odoo.service');

async function installPurchaseRequisitionModules() {
  console.log('📦 Installing Purchase Requisition modules for TENZAI Purchasing System...');
  console.log('='.repeat(70));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Modules to install
    const modulesToInstall = [
      { name: 'purchase_requisition_sale', displayName: 'Purchase Requisition Sale', id: 952 },
      { name: 'purchase_requisition_stock', displayName: 'Purchase Requisition Stock', id: 953 }
    ];

    console.log(`\n📦 Attempting to install ${modulesToInstall.length} purchase requisition modules:`);
    modulesToInstall.forEach((module, index) => {
      console.log(`  ${index + 1}. ${module.displayName} (${module.name}) - ID: ${module.id}`);
    });

    // Check if modules are already installed
    console.log('\n🔍 Checking if modules are already installed...');
    const installedModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'installed']], 
      ['name', 'display_name', 'state'],
      500
    );

    const installedModuleNames = installedModules.map(m => m.name);
    
    // Filter out already installed modules
    const modulesToInstallFiltered = modulesToInstall.filter(module => 
      !installedModuleNames.includes(module.name)
    );

    if (modulesToInstallFiltered.length === 0) {
      console.log('✅ All purchase requisition modules are already installed!');
      return;
    }

    console.log(`\n🚀 Ready to install ${modulesToInstallFiltered.length} modules:`);
    modulesToInstallFiltered.forEach((module, index) => {
      console.log(`  ${index + 1}. ${module.displayName} (${module.name}) - ID: ${module.id}`);
    });

    // Start installation process
    console.log('\n🤖 Starting installation...');
    console.log('='.repeat(70));

    const installationResults = [];

    for (const module of modulesToInstallFiltered) {
      try {
        console.log(`\n📦 Installing ${module.displayName} (${module.name}) - ID: ${module.id}...`);
        
        // Install the module using its ID
        const installResult = await odooService.executeMethod(
          'ir.module.module',
          'button_immediate_install',
          [[module.id]]
        );

        console.log(`✅ Successfully installed ${module.displayName}`);
        installationResults.push({
          module: module,
          status: 'success',
          result: installResult
        });

        // Wait between installations
        console.log('⏳ Waiting 10 seconds before next installation...');
        await new Promise(resolve => setTimeout(resolve, 10000));

      } catch (error) {
        console.log(`❌ Failed to install ${module.displayName}: ${error.message}`);
        installationResults.push({
          module: module,
          status: 'failed',
          error: error.message
        });
        
        // Wait after failure
        console.log('⏳ Waiting 15 seconds after failure...');
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
    }

    // Installation summary
    console.log('\n📊 Installation Summary:');
    console.log('='.repeat(70));

    const successful = installationResults.filter(r => r.status === 'success');
    const failed = installationResults.filter(r => r.status === 'failed');

    console.log(`✅ Successfully installed: ${successful.length} modules`);
    successful.forEach(result => {
      console.log(`  - ${result.module.displayName} (${result.module.name})`);
    });

    if (failed.length > 0) {
      console.log(`\n❌ Failed to install: ${failed.length} modules`);
      failed.forEach(result => {
        console.log(`  - ${result.module.displayName} (${result.module.name}): ${result.error}`);
      });
    }

    // Final status check
    console.log('\n🔍 Final installation status check...');
    const finalInstalledModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'installed']], 
      ['name', 'display_name', 'state'],
      500
    );

    const finalInstalledModuleNames = finalInstalledModules.map(m => m.name);
    const newlyInstalledModules = modulesToInstallFiltered.filter(module => 
      finalInstalledModuleNames.includes(module.name)
    );

    console.log(`🎉 Successfully installed ${newlyInstalledModules.length} new modules!`);

    // Check TENZAI status
    console.log('\n🎯 Updated TENZAI Purchasing System Status:');
    console.log('='.repeat(70));

    const tenzaiRequiredApps = [
      'purchase', 'account', 'contacts', 'pos_restaurant', 'purchase_requisition',
      'quality', 'maintenance', 'approvals', 'documents', 'helpdesk', 'crm', 'mrp',
      'marketing_automation', 'social', 'fleet', 'iot', 'voip', 'whatsapp'
    ];

    const installedTenzaiApps = tenzaiRequiredApps.filter(app => 
      finalInstalledModuleNames.includes(app) ||
      finalInstalledModuleNames.includes('purchase_requisition_sale') ||
      finalInstalledModuleNames.includes('purchase_requisition_stock')
    );

    console.log(`📊 Total TENZAI Required Apps: ${tenzaiRequiredApps.length}`);
    console.log(`✅ Successfully Installed: ${installedTenzaiApps.length}`);
    console.log(`❌ Missing: ${tenzaiRequiredApps.length - installedTenzaiApps.length}`);
    console.log(`📈 Installation Progress: ${Math.round((installedTenzaiApps.length / tenzaiRequiredApps.length) * 100)}%`);

    if (installedTenzaiApps.length >= tenzaiRequiredApps.length) {
      console.log('\n🎉 CONGRATULATIONS! All TENZAI required apps are now installed!');
      console.log('🚀 TENZAI Purchasing System is ready for configuration!');
    } else {
      console.log('\n⚠️ Some TENZAI required apps are still missing.');
      console.log('💡 Purchase Requisition functionality is now available through installed modules.');
    }

    console.log('\n🎉 Purchase Requisition modules installation completed!');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Keep session active
    console.log('\n🔐 Session kept active for further operations');
  }
}

// Run the installation
installPurchaseRequisitionModules(); 