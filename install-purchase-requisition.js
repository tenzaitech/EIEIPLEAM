const OdooService = require('./src/services/odoo.service');

async function installPurchaseRequisition() {
  console.log('📦 Installing Purchase Requisition for TENZAI Purchasing System...');
  console.log('='.repeat(70));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Check if Purchase Requisition is already installed
    console.log('\n🔍 Checking if Purchase Requisition is already installed...');
    const installedModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'installed']], 
      ['name', 'display_name', 'state'],
      500
    );

    const isAlreadyInstalled = installedModules.some(module => module.name === 'purchase_requisition');
    
    if (isAlreadyInstalled) {
      console.log('✅ Purchase Requisition is already installed!');
      return;
    }

    // Check available modules for installation
    console.log('\n🔍 Checking available modules for installation...');
    const availableModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'uninstalled']], 
      ['name', 'display_name', 'state', 'application', 'id'],
      500
    );

    const purchaseRequisitionModule = availableModules.find(module => module.name === 'purchase_requisition');
    
    if (!purchaseRequisitionModule) {
      console.log('❌ Purchase Requisition module not found in available modules');
      console.log('💡 This module may need to be purchased or is not available in this Odoo version');
      return;
    }

    console.log(`📦 Found Purchase Requisition module - ID: ${purchaseRequisitionModule.id}`);
    console.log(`📝 Display Name: ${purchaseRequisitionModule.display_name}`);

    // Install the module
    console.log('\n🚀 Installing Purchase Requisition...');
    console.log('='.repeat(70));

    try {
      const installResult = await odooService.executeMethod(
        'ir.module.module',
        'button_immediate_install',
        [[purchaseRequisitionModule.id]]
      );

      console.log('✅ Successfully installed Purchase Requisition!');
      console.log('📊 Installation result:', installResult);

      // Wait a bit for the installation to complete
      console.log('⏳ Waiting for installation to complete...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Verify installation
      console.log('\n🔍 Verifying installation...');
      const finalInstalledModules = await odooService.search(
        'ir.module.module', 
        [['state', '=', 'installed']], 
        ['name', 'display_name', 'state'],
        500
      );

      const isNowInstalled = finalInstalledModules.some(module => module.name === 'purchase_requisition');
      
      if (isNowInstalled) {
        console.log('✅ Purchase Requisition installation verified successfully!');
      } else {
        console.log('⚠️ Purchase Requisition installation verification failed');
      }

    } catch (error) {
      console.log(`❌ Failed to install Purchase Requisition: ${error.message}`);
      throw error;
    }

    // Final status check
    console.log('\n📊 Final TENZAI Purchasing System Status:');
    console.log('='.repeat(70));

    const tenzaiRequiredApps = [
      'purchase', 'account', 'contacts', 'pos_restaurant', 'purchase_requisition',
      'quality', 'maintenance', 'approvals', 'documents', 'helpdesk', 'crm', 'mrp',
      'marketing_automation', 'social', 'fleet', 'iot', 'voip', 'whatsapp'
    ];

    const finalInstalledAppNames = finalInstalledModules.map(m => m.name);
    const installedTenzaiApps = tenzaiRequiredApps.filter(app => 
      finalInstalledAppNames.includes(app)
    );

    console.log(`📊 Total TENZAI Required Apps: ${tenzaiRequiredApps.length}`);
    console.log(`✅ Successfully Installed: ${installedTenzaiApps.length}`);
    console.log(`❌ Missing: ${tenzaiRequiredApps.length - installedTenzaiApps.length}`);
    console.log(`📈 Installation Progress: ${Math.round((installedTenzaiApps.length / tenzaiRequiredApps.length) * 100)}%`);

    if (installedTenzaiApps.length === tenzaiRequiredApps.length) {
      console.log('\n🎉 CONGRATULATIONS! All TENZAI required apps are now installed!');
      console.log('🚀 TENZAI Purchasing System is ready for configuration!');
    } else {
      console.log('\n⚠️ Some TENZAI required apps are still missing.');
    }

    console.log('\n🎉 Purchase Requisition installation completed!');
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
installPurchaseRequisition(); 