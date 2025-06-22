#!/usr/bin/env node

/**
 * 🧪 Advanced CRUD Testing Script
 * สำหรับทดสอบ Field Validation, Permissions และ Performance
 * 
 * Usage:
 * node test-advanced-crud.js [test-type]
 * 
 * Test Types:
 * - all: ทดสอบทั้งหมด
 * - crud: ทดสอบ CRUD operations
 * - validation: ทดสอบ field validation
 * - performance: ทดสอบ performance
 * - permissions: ทดสอบ permissions
 */

const TenzaiMasterToolkit = require('./master-toolkit.js');

async function runTests() {
  const toolkit = new TenzaiMasterToolkit();
  const testType = process.argv[2] || 'all';

  console.log('🧪 TENZAI Advanced Testing Suite');
  console.log('='.repeat(60));
  console.log(`🔧 Test Type: ${testType.toUpperCase()}`);
  console.log('='.repeat(60));

  try {
    // Authenticate first
    await toolkit.authenticate();
    console.log('✅ Authentication successful\n');

    const results = {};

    // Run tests based on type
    switch (testType.toLowerCase()) {
      case 'all':
        console.log('🚀 Running ALL Tests...\n');
        
        // 1. Advanced CRUD Tests
        console.log('📦 1. Advanced CRUD Testing');
        results.crud = await toolkit.testAdvancedCRUD();
        console.log('\n');

        // 2. Field Validation Tests
        console.log('🔍 2. Field Validation Testing');
        results.validation = await toolkit.testFieldValidation();
        console.log('\n');

        // 3. Performance Tests
        console.log('📊 3. Performance Testing');
        results.performance = await toolkit.testPerformance();
        console.log('\n');

        // 4. Permission Tests
        console.log('🔐 4. Permission Testing');
        results.permissions = await toolkit.managePermissions();
        console.log('\n');

        // 5. User Role Tests
        console.log('👤 5. User Role Testing');
        results.userRoles = await toolkit.manageUserRoles();
        console.log('\n');

        // 6. Create TENZAI Groups
        console.log('🔒 6. Creating TENZAI Groups');
        results.tenzaiGroups = await toolkit.createTenzaiUserGroups();
        console.log('\n');

        break;

      case 'crud':
        console.log('📦 Running Advanced CRUD Tests...\n');
        results.crud = await toolkit.testAdvancedCRUD();
        break;

      case 'validation':
        console.log('🔍 Running Field Validation Tests...\n');
        results.validation = await toolkit.testFieldValidation();
        break;

      case 'performance':
        console.log('📊 Running Performance Tests...\n');
        results.performance = await toolkit.testPerformance();
        break;

      case 'permissions':
        console.log('🔐 Running Permission Tests...\n');
        results.permissions = await toolkit.managePermissions();
        results.userRoles = await toolkit.manageUserRoles();
        results.tenzaiGroups = await toolkit.createTenzaiUserGroups();
        break;

      default:
        console.log('❌ Unknown test type. Available types: all, crud, validation, performance, permissions');
        process.exit(1);
    }

    // Print Summary
    console.log('📋 Test Results Summary');
    console.log('='.repeat(60));
    
    if (results.crud) {
      console.log('✅ Advanced CRUD Tests:', results.crud.productCRUD ? 'PASSED' : 'FAILED');
    }
    
    if (results.validation) {
      console.log('✅ Field Validation Tests:');
      Object.entries(results.validation).forEach(([test, result]) => {
        if (test !== 'error') {
          console.log(`   - ${test}: ${result}`);
        }
      });
    }
    
    if (results.performance) {
      console.log('✅ Performance Tests:');
      console.log(`   - Total Time: ${results.performance.summary?.totalTime}ms`);
      console.log(`   - Average Time: ${results.performance.summary?.averageTime}ms`);
    }
    
    if (results.permissions) {
      console.log('✅ Permission Tests:');
      console.log(`   - Groups: ${results.permissions.groups?.length || 0}`);
      console.log(`   - Access Rights: ${results.permissions.accessRights?.length || 0}`);
      console.log(`   - Record Rules: ${results.permissions.recordRules?.length || 0}`);
    }

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = { runTests }; 