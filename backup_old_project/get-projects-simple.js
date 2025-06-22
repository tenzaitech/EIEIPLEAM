const OdooService = require('./src/services/odoo.service');

async function getProjectsSimple() {
  console.log('📋 Getting projects from Odoo (Simple version)...');
  console.log('='.repeat(50));

  const odooService = new OdooService();

  try {
    // Test authentication first
    console.log('🔐 Testing authentication...');
    const authResult = await odooService.authenticate();
    console.log('✅ Authentication successful:', authResult);

    // Get all projects with basic fields
    console.log('\n📋 Getting all projects...');
    
    try {
      console.log('🔍 Getting all projects from project.project...');
      
      // Use only basic fields that should exist
      const projects = await odooService.search(
        'project.project', 
        [], // Empty domain to get all records
        ['id', 'name'], // Only basic fields
        100
      );
      
      if (projects && projects.length > 0) {
        console.log(`✅ Found ${projects.length} projects:`);
        projects.forEach((project, index) => {
          console.log(`  ${index + 1}. ID: ${project.id}, Name: ${project.name}`);
        });
      } else {
        console.log('❌ No projects found');
      }
    } catch (error) {
      console.log(`⚠️ Error getting projects: ${error.message}`);
    }

    // Try to get tasks
    console.log('\n📋 Getting all tasks...');
    try {
      const tasks = await odooService.search(
        'project.task', 
        [], 
        ['id', 'name'], 
        100
      );
      
      if (tasks && tasks.length > 0) {
        console.log(`✅ Found ${tasks.length} tasks:`);
        tasks.forEach((task, index) => {
          console.log(`  ${index + 1}. ID: ${task.id}, Name: ${task.name}`);
        });
      } else {
        console.log('❌ No tasks found');
      }
    } catch (error) {
      console.log(`⚠️ Error getting tasks: ${error.message}`);
    }

    // Try to get all available models
    console.log('\n🔍 Getting all available models...');
    try {
      const models = await odooService.search(
        'ir.model', 
        [], 
        ['id', 'name', 'model'], 
        50
      );
      
      if (models && models.length > 0) {
        console.log(`✅ Found ${models.length} models (showing first 20):`);
        models.slice(0, 20).forEach((model, index) => {
          console.log(`  ${index + 1}. Model: ${model.model}, Name: ${model.name}`);
        });
      }
    } catch (error) {
      console.log(`⚠️ Error getting models: ${error.message}`);
    }

    console.log('\n🎉 Project retrieval completed!');
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
getProjectsSimple(); 