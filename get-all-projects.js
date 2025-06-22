const OdooService = require('./src/services/odoo.service');

async function getAllProjects() {
  console.log('📋 Getting all projects from Odoo...');
  console.log('='.repeat(50));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Get all projects
    console.log('\n📋 Getting all projects...');
    
    // Try different project-related models
    const projectModels = [
      'project.project',
      'project.task',
      'project.milestone',
      'project.tag'
    ];

    for (const model of projectModels) {
      try {
        console.log(`\n🔍 Getting all records from ${model}...`);
        
        // Get all records without any domain filter
        const records = await odooService.search(
          model, 
          [], // Empty domain to get all records
          ['id', 'name', 'description', 'partner_id', 'user_id', 'date_start', 'date', 'state', 'priority'],
          100
        );
        
        if (records && records.length > 0) {
          console.log(`✅ Found ${records.length} records in ${model}:`);
          records.forEach((record, index) => {
            console.log(`  ${index + 1}. ID: ${record.id}, Name: ${record.name}`);
            if (record.description) {
              console.log(`     Description: ${record.description.substring(0, 100)}...`);
            }
            if (record.state) {
              console.log(`     State: ${record.state}`);
            }
            if (record.priority) {
              console.log(`     Priority: ${record.priority}`);
            }
            if (record.date_start) {
              console.log(`     Start Date: ${record.date_start}`);
            }
            console.log('');
          });
        } else {
          console.log(`❌ No records found in ${model}`);
        }
      } catch (error) {
        console.log(`⚠️ Error getting ${model}: ${error.message}`);
      }
    }

    // Also try to get project categories or stages
    console.log('\n🔍 Getting project stages and categories...');
    try {
      const stages = await odooService.search(
        'project.task.type', 
        [], 
        ['id', 'name', 'description', 'sequence'],
        50
      );
      
      if (stages && stages.length > 0) {
        console.log(`✅ Found ${stages.length} project stages:`);
        stages.forEach((stage, index) => {
          console.log(`  ${index + 1}. ID: ${stage.id}, Name: ${stage.name}`);
        });
      }
    } catch (error) {
      console.log(`⚠️ Error getting project stages: ${error.message}`);
    }

    console.log('\n🎉 All projects retrieved!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Failed to get projects:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Cleanup
    await odooService.logout();
    process.exit(0);
  }
}

// Run the function
getAllProjects(); 