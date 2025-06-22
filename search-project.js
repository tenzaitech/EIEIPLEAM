const OdooService = require('./src/services/odoo.service');

async function searchTestProject() {
  console.log('🔍 Searching for project named "test"...');
  console.log('='.repeat(50));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Search for projects with name containing "test"
    console.log('\n📋 Searching for projects...');
    
    // Try different project models
    const projectModels = [
      'project.project',
      'project.task',
      'project.issue',
      'project.scrum.sprint'
    ];

    for (const model of projectModels) {
      try {
        console.log(`\n🔍 Searching in ${model}...`);
        const projects = await odooService.search(
          model, 
          [['name', 'ilike', 'test']], 
          ['id', 'name', 'description', 'partner_id', 'user_id', 'date_start', 'date'],
          10
        );
        
        if (projects && projects.length > 0) {
          console.log(`✅ Found ${projects.length} records in ${model}:`);
          projects.forEach((project, index) => {
            console.log(`  ${index + 1}. ID: ${project.id}, Name: ${project.name}`);
            if (project.description) {
              console.log(`     Description: ${project.description.substring(0, 100)}...`);
            }
          });
        } else {
          console.log(`❌ No records found in ${model}`);
        }
      } catch (error) {
        console.log(`⚠️ Error searching ${model}: ${error.message}`);
      }
    }

    // Also try searching in all models for "test"
    console.log('\n🔍 Searching all models for "test"...');
    try {
      const allResults = await odooService.search(
        'ir.model', 
        [['name', 'ilike', 'test']], 
        ['id', 'name', 'model', 'state'],
        20
      );
      
      if (allResults && allResults.length > 0) {
        console.log(`✅ Found ${allResults.length} models containing "test":`);
        allResults.forEach((model, index) => {
          console.log(`  ${index + 1}. Model: ${model.model}, Name: ${model.name}`);
        });
      }
    } catch (error) {
      console.log(`⚠️ Error searching models: ${error.message}`);
    }

    console.log('\n🎉 Search completed!');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Search failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    // Cleanup
    await odooService.logout();
    process.exit(0);
  }
}

// Run the search
searchTestProject(); 