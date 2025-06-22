const OdooService = require('./src/services/odoo.service');

async function installRemainingApps() {
  console.log('🔄 Installing remaining apps for TENZAI Purchasing System...');
  console.log('='.repeat(70));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Apps that failed to install in the first run
    const remainingApps = [
      { name: 'purchase', displayName: 'Purchase Management', priority: 1, category: 'Core Business' },
      { name: 'account', displayName: 'Accounting', priority: 1, category: 'Core Business' },
      { name: 'contacts', displayName: 'Contact Management', priority: 1, category: 'Core Business' },
      { name: 'pos_restaurant', displayName: 'Restaurant Management', priority: 1, category: 'Restaurant' },
      { name: 'quality', displayName: 'Quality Management', priority: 2, category: 'Advanced Features' },
      { name: 'maintenance', displayName: 'Maintenance Management', priority: 2, category: 'Advanced Features' },
      { name: 'social', displayName: 'Social Marketing', priority: 4, category: 'Marketing' },
      { name: 'fleet', displayName: 'Fleet Management', priority: 4, category: 'Logistics' },
    ];

    console.log(`\n📦 Attempting to install ${remainingApps.length} remaining apps:`);
    remainingApps.forEach((app, index) => {
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
    const installableApps = remainingApps
      .filter(app => availableAppNames.includes(app.name))
      .map(app => ({
        ...app,
        moduleId: moduleNameToId[app.name]
      }));

    if (installableApps.length === 0) {
      console.log('\n❌ No remaining apps are available for installation');
      return;
    }

    console.log(`\n🚀 Ready to install ${installableApps.length} apps:`);
    installableApps.forEach((app, index) => {
      console.log(`  ${index + 1}. ${app.displayName} (${app.name}) - ID: ${app.moduleId}`);
    });

    // Start installation process with longer delays
    console.log('\n🤖 Starting installation with extended delays...');
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

        // Wait longer between installations to avoid conflicts
        console.log('⏳ Waiting 10 seconds before next installation...');
        await new Promise(resolve => setTimeout(resolve, 10000));

      } catch (error) {
        console.log(`❌ Failed to install ${app.displayName}: ${error.message}`);
        installationResults.push({
          app: app,
          status: 'failed',
          error: error.message
        });
        
        // Wait even longer after a failure
        console.log('⏳ Waiting 15 seconds after failure...');
        await new Promise(resolve => setTimeout(resolve, 15000));
      }
    }

    // Installation summary
    console.log('\n📊 Installation Summary:');
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

    console.log(`🎉 Successfully installed ${newlyInstalledApps.length} new apps!`);

    console.log('\n🎉 Remaining apps installation completed!');
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
installRemainingApps(); 