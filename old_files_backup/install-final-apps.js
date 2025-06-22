const OdooService = require('./src/services/odoo.service');

async function installFinalApps() {
  console.log('🎯 Installing final remaining apps for TENZAI Purchasing System...');
  console.log('='.repeat(70));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Final apps that need to be installed
    const finalApps = [
      { name: 'purchase', displayName: 'Purchase Management', priority: 1, category: 'Core Business' },
      { name: 'account', displayName: 'Accounting', priority: 1, category: 'Core Business' },
      { name: 'contacts', displayName: 'Contact Management', priority: 1, category: 'Core Business' },
      { name: 'quality', displayName: 'Quality Management', priority: 2, category: 'Advanced Features' },
    ];

    console.log(`\n📦 Attempting to install ${finalApps.length} final apps:`);
    finalApps.forEach((app, index) => {
      console.log(`  ${index + 1}. ${app.displayName} (${app.name})`);
    });

    // Check available apps for installation and get their IDs
    console.log('\n🔍 Checking available apps for installation...');
    const availableModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'uninstalled']], 
      ['name', 'display_name', 'state', 'application', 'id'],
      200
    );

    const availableAppNames = availableModules.map(m => m.name);
    console.log(`📦 Found ${availableAppNames.length} available modules`);

    // Create a map of module names to IDs
    const moduleNameToId = {};
    availableModules.forEach(module => {
      moduleNameToId[module.name] = module.id;
    });

    // Filter apps that are actually available and add their IDs
    const installableApps = finalApps
      .filter(app => availableAppNames.includes(app.name))
      .map(app => ({
        ...app,
        moduleId: moduleNameToId[app.name]
      }));

    if (installableApps.length === 0) {
      console.log('\n❌ No final apps are available for installation');
      console.log('💡 All required apps may have been installed or are not available');
      return;
    }

    console.log(`\n🚀 Ready to install ${installableApps.length} final apps:`);
    installableApps.forEach((app, index) => {
      console.log(`  ${index + 1}. ${app.displayName} (${app.name}) - ID: ${app.moduleId}`);
    });

    // Start installation process with very long delays
    console.log('\n🤖 Starting final installation with extended delays...');
    console.log('='.repeat(70));

    const installationResults = [];

    for (const app of installableApps) {
      try {
        console.log(`\n📦 Installing ${app.displayName} (${app.name}) - ID: ${app.moduleId}...`);
        
        // Install the module using its ID
        const installResult = await odooService.executeMethod(
          'ir.module.module',
          'button_immediate_install',
          [[app.moduleId]]
        );

        console.log(`✅ Successfully installed ${app.displayName}`);
        installationResults.push({
          app: app,
          status: 'success',
          result: installResult
        });

        // Wait much longer between installations to avoid conflicts
        console.log('⏳ Waiting 20 seconds before next installation...');
        await new Promise(resolve => setTimeout(resolve, 20000));

      } catch (error) {
        console.log(`❌ Failed to install ${app.displayName}: ${error.message}`);
        installationResults.push({
          app: app,
          status: 'failed',
          error: error.message
        });
        
        // Wait even longer after a failure
        console.log('⏳ Waiting 30 seconds after failure...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }

    // Installation summary
    console.log('\n📊 Final Installation Summary:');
    console.log('='.repeat(70));

    const successful = installationResults.filter(r => r.status === 'success');
    const failed = installationResults.filter(r => r.status === 'failed');

    console.log(`✅ Successfully installed: ${successful.length} apps`);
    successful.forEach(result => {
      console.log(`  - ${result.app.displayName} (${result.app.name})`);
    });

    if (failed.length > 0) {
      console.log(`\n❌ Failed to install: ${failed.length} apps`);
      failed.forEach(result => {
        console.log(`  - ${result.app.displayName} (${result.app.name}): ${result.error}`);
      });
    }

    // Check final installation status
    console.log('\n🔍 Final installation status check...');
    const finalInstalledModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'installed']], 
      ['name', 'display_name', 'state'],
      200
    );

    const finalInstalledAppNames = finalInstalledModules.map(m => m.name);
    const newlyInstalledApps = installableApps.filter(app => 
      finalInstalledAppNames.includes(app.name)
    );

    console.log(`🎉 Successfully installed ${newlyInstalledApps.length} final apps!`);

    // Overall summary
    console.log('\n🎯 Overall TENZAI Purchasing System Installation Summary:');
    console.log('='.repeat(70));
    
    const allRequiredApps = [
      'purchase', 'account', 'contacts', 'pos_restaurant', 'purchase_requisition',
      'quality', 'maintenance', 'approvals', 'documents', 'helpdesk', 'crm', 'mrp',
      'marketing_automation', 'social', 'fleet', 'iot', 'voip', 'whatsapp'
    ];

    const installedApps = allRequiredApps.filter(app => 
      finalInstalledAppNames.includes(app)
    );

    console.log(`📊 Total Required Apps: ${allRequiredApps.length}`);
    console.log(`✅ Successfully Installed: ${installedApps.length}`);
    console.log(`❌ Not Installed: ${allRequiredApps.length - installedApps.length}`);
    console.log(`📈 Installation Success Rate: ${Math.round((installedApps.length / allRequiredApps.length) * 100)}%`);

    if (installedApps.length === allRequiredApps.length) {
      console.log('\n🎉 CONGRATULATIONS! All required apps have been installed successfully!');
      console.log('🚀 TENZAI Purchasing System is ready for configuration!');
    } else {
      console.log('\n⚠️ Some apps could not be installed automatically.');
      console.log('💡 You may need to install them manually through the Odoo Apps menu.');
    }

    console.log('\n🎉 Final apps installation completed!');
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
installFinalApps(); 