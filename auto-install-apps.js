const OdooService = require('./src/services/odoo.service');

async function autoInstallApps() {
  console.log('🤖 Auto-installing required Odoo apps for TENZAI Purchasing System...');
  console.log('='.repeat(70));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Priority-based app installation list
    const appsToInstall = [
      // Priority 1: Critical Business Apps
      { name: 'purchase', displayName: 'Purchase Management', priority: 1, category: 'Core Business' },
      { name: 'account', displayName: 'Accounting', priority: 1, category: 'Core Business' },
      { name: 'contacts', displayName: 'Contact Management', priority: 1, category: 'Core Business' },
      { name: 'pos_restaurant', displayName: 'Restaurant Management', priority: 1, category: 'Restaurant' },
      
      // Priority 2: Advanced Features
      { name: 'purchase_requisition', displayName: 'Purchase Requisition', priority: 2, category: 'Advanced Features' },
      { name: 'quality', displayName: 'Quality Management', priority: 2, category: 'Advanced Features' },
      { name: 'maintenance', displayName: 'Maintenance Management', priority: 2, category: 'Advanced Features' },
      { name: 'approvals', displayName: 'Approval Workflows', priority: 2, category: 'Workflow' },
      
      // Priority 3: Additional Features
      { name: 'documents', displayName: 'Document Management', priority: 3, category: 'Additional Features' },
      { name: 'helpdesk', displayName: 'Help Desk', priority: 3, category: 'Additional Features' },
      { name: 'crm', displayName: 'Customer Relationship Management', priority: 3, category: 'Sales' },
      { name: 'mrp', displayName: 'Manufacturing', priority: 3, category: 'Manufacturing' },
      
      // Priority 4: Integration & Automation
      { name: 'marketing_automation', displayName: 'Marketing Automation', priority: 4, category: 'Marketing' },
      { name: 'social', displayName: 'Social Marketing', priority: 4, category: 'Marketing' },
      { name: 'fleet', displayName: 'Fleet Management', priority: 4, category: 'Logistics' },
      { name: 'iot', displayName: 'Internet of Things', priority: 4, category: 'Technology' },
      { name: 'voip', displayName: 'VoIP Integration', priority: 4, category: 'Communication' },
      { name: 'whatsapp', displayName: 'WhatsApp Messaging', priority: 4, category: 'Communication' },
    ];

    console.log('\n📋 Apps to be installed (Priority-based):');
    console.log('='.repeat(70));

    // Group apps by priority
    const priorityGroups = {};
    appsToInstall.forEach(app => {
      if (!priorityGroups[app.priority]) {
        priorityGroups[app.priority] = [];
      }
      priorityGroups[app.priority].push(app);
    });

    Object.keys(priorityGroups).sort().forEach(priority => {
      console.log(`\n🔥 Priority ${priority} (Critical):`);
      priorityGroups[priority].forEach(app => {
        console.log(`  - ${app.displayName} (${app.name}) - ${app.category}`);
      });
    });

    // Check currently installed apps
    console.log('\n🔍 Checking currently installed apps...');
    const installedModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'installed']], 
      ['name', 'display_name', 'state'],
      200
    );

    const installedAppNames = installedModules.map(m => m.name);
    console.log(`✅ Found ${installedAppNames.length} installed modules`);

    // Filter out already installed apps
    const appsToInstallFiltered = appsToInstall.filter(app => 
      !installedAppNames.includes(app.name)
    );

    if (appsToInstallFiltered.length === 0) {
      console.log('\n🎉 All required apps are already installed!');
      return;
    }

    console.log(`\n📦 Need to install ${appsToInstallFiltered.length} apps:`);
    appsToInstallFiltered.forEach((app, index) => {
      console.log(`  ${index + 1}. ${app.displayName} (${app.name})`);
    });

    // Check available apps for installation
    console.log('\n🔍 Checking available apps for installation...');
    const availableModules = await odooService.search(
      'ir.module.module', 
      [['state', '=', 'uninstalled']], 
      ['name', 'display_name', 'state', 'application'],
      200
    );

    const availableAppNames = availableModules.map(m => m.name);
    console.log(`📦 Found ${availableAppNames.length} available modules`);

    // Filter apps that are actually available
    const installableApps = appsToInstallFiltered.filter(app => 
      availableAppNames.includes(app.name)
    );

    if (installableApps.length === 0) {
      console.log('\n❌ No required apps are available for installation');
      console.log('💡 Some apps may need to be purchased or are not available in this Odoo version');
      return;
    }

    console.log(`\n🚀 Ready to install ${installableApps.length} apps:`);
    installableApps.forEach((app, index) => {
      console.log(`  ${index + 1}. ${app.displayName} (${app.name})`);
    });

    // Start installation process
    console.log('\n🤖 Starting automatic installation...');
    console.log('='.repeat(70));

    const installationResults = [];

    for (const app of installableApps) {
      try {
        console.log(`\n📦 Installing ${app.displayName} (${app.name})...`);
        
        // Install the module
        const installResult = await odooService.executeMethod(
          'ir.module.module',
          'button_immediate_install',
          [[app.name]]
        );

        console.log(`✅ Successfully installed ${app.displayName}`);
        installationResults.push({
          app: app,
          status: 'success',
          result: installResult
        });

        // Wait a bit between installations to avoid overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.log(`❌ Failed to install ${app.displayName}: ${error.message}`);
        installationResults.push({
          app: app,
          status: 'failed',
          error: error.message
        });
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

    // Post-installation setup
    console.log('\n🔧 Post-installation setup recommendations:');
    console.log('='.repeat(70));
    console.log('1. Configure user permissions and access rights');
    console.log('2. Set up approval workflows for purchase requisitions');
    console.log('3. Configure quality control processes');
    console.log('4. Set up maintenance schedules');
    console.log('5. Configure document management workflows');
    console.log('6. Set up CRM pipelines and sales processes');
    console.log('7. Configure manufacturing workflows');
    console.log('8. Set up automation rules and notifications');
    console.log('9. Configure reporting dashboards');
    console.log('10. Test integration with TENZAI Purchasing System');

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

    console.log('\n🎉 Auto-installation completed!');
    console.log('='.repeat(70));

  } catch (error) {
    console.error('❌ Auto-installation failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Keep session active
    console.log('\n🔐 Session kept active for further operations');
  }
}

// Run the auto-installation
autoInstallApps(); 