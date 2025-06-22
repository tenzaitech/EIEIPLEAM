const OdooService = require('./src/services/odoo.service');

class DuplicateProductChecker {
  constructor() {
    this.odooService = new OdooService();
    this.isAuthenticated = false;
  }

  async authenticate() {
    try {
      const result = await this.odooService.authenticate();
      this.isAuthenticated = result.success;
      return result;
    } catch (error) {
      console.error('❌ Authentication failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // 🔍 ตรวจสอบสินค้าทั้งหมด
  async getAllProducts() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    try {
      console.log('🔍 Fetching all products...');
      const products = await this.odooService.search('product.template', [], [
        'id', 'name', 'default_code', 'categ_id', 'list_price', 'create_date'
      ], 1000);
      
      return products;
    } catch (error) {
      console.error('❌ Error fetching products:', error.message);
      return [];
    }
  }

  // 🔍 ตรวจสอบสินค้าที่ซ้ำ
  findDuplicates(products) {
    console.log('🔍 Analyzing products for duplicates...');
    
    const duplicates = {
      byName: {},
      byCode: {},
      byNameAndCategory: {}
    };

    // ตรวจสอบซ้ำตามชื่อ
    products.forEach(product => {
      const name = product.name?.toLowerCase().trim();
      if (name) {
        if (!duplicates.byName[name]) {
          duplicates.byName[name] = [];
        }
        duplicates.byName[name].push(product);
      }
    });

    // ตรวจสอบซ้ำตามรหัส
    products.forEach(product => {
      const code = (product.default_code !== undefined && product.default_code !== null) ? String(product.default_code).toLowerCase().trim() : null;
      if (code) {
        if (!duplicates.byCode[code]) {
          duplicates.byCode[code] = [];
        }
        duplicates.byCode[code].push(product);
      }
    });

    // ตรวจสอบซ้ำตามชื่อและหมวดหมู่
    products.forEach(product => {
      const name = product.name?.toLowerCase().trim();
      const categoryId = product.categ_id?.[0];
      const key = `${name}_${categoryId}`;
      
      if (name && categoryId) {
        if (!duplicates.byNameAndCategory[key]) {
          duplicates.byNameAndCategory[key] = [];
        }
        duplicates.byNameAndCategory[key].push(product);
      }
    });

    return duplicates;
  }

  // 📊 แสดงผลการตรวจสอบ
  displayDuplicates(duplicates) {
    console.log('\n📊 DUPLICATE ANALYSIS RESULTS');
    console.log('='.repeat(60));

    let totalDuplicates = 0;
    let duplicateGroups = 0;

    // แสดงซ้ำตามชื่อ
    console.log('\n🔍 DUPLICATES BY NAME:');
    Object.entries(duplicates.byName).forEach(([name, products]) => {
      if (products.length > 1) {
        duplicateGroups++;
        totalDuplicates += products.length - 1;
        console.log(`\n📝 "${name}" (${products.length} items):`);
        products.forEach((product, index) => {
          const category = product.categ_id?.[1] || 'No Category';
          const price = product.list_price || 0;
          console.log(`  ${index + 1}. ID: ${product.id} | Code: ${product.default_code || 'N/A'} | Category: ${category} | Price: ${price}`);
        });
      }
    });

    // แสดงซ้ำตามรหัส
    console.log('\n🔍 DUPLICATES BY CODE:');
    Object.entries(duplicates.byCode).forEach(([code, products]) => {
      if (products.length > 1) {
        duplicateGroups++;
        totalDuplicates += products.length - 1;
        console.log(`\n📝 Code "${code}" (${products.length} items):`);
        products.forEach((product, index) => {
          const category = product.categ_id?.[1] || 'No Category';
          const price = product.list_price || 0;
          console.log(`  ${index + 1}. ID: ${product.id} | Name: ${product.name} | Category: ${category} | Price: ${price}`);
        });
      }
    });

    // แสดงซ้ำตามชื่อและหมวดหมู่
    console.log('\n🔍 DUPLICATES BY NAME AND CATEGORY:');
    Object.entries(duplicates.byNameAndCategory).forEach(([key, products]) => {
      if (products.length > 1) {
        duplicateGroups++;
        totalDuplicates += products.length - 1;
        const [name, categoryId] = key.split('_');
        const category = products[0].categ_id?.[1] || 'No Category';
        console.log(`\n📝 "${name}" in category "${category}" (${products.length} items):`);
        products.forEach((product, index) => {
          const price = product.list_price || 0;
          console.log(`  ${index + 1}. ID: ${product.id} | Code: ${product.default_code || 'N/A'} | Price: ${price}`);
        });
      }
    });

    console.log('\n📊 SUMMARY:');
    console.log(`Total duplicate groups: ${duplicateGroups}`);
    console.log(`Total duplicate items: ${totalDuplicates}`);
    console.log(`Total products analyzed: ${Object.values(duplicates.byName).flat().length}`);

    return { duplicateGroups, totalDuplicates };
  }

  // 🗑️ ลบสินค้าที่ซ้ำ
  async deleteDuplicates(duplicates, keepStrategy = 'newest') {
    console.log(`\n🗑️ DELETING DUPLICATES (keeping ${keepStrategy})`);
    console.log('='.repeat(60));

    let deletedCount = 0;
    let errorCount = 0;

    // ลบซ้ำตามชื่อ
    for (const [name, products] of Object.entries(duplicates.byName)) {
      if (products.length > 1) {
        const sortedProducts = this.sortProductsByStrategy(products, keepStrategy);
        const toDelete = sortedProducts.slice(1); // เก็บอันแรก ลบที่เหลือ

        console.log(`\n🗑️ Deleting duplicates for "${name}":`);
        for (const product of toDelete) {
          try {
            console.log(`  Deleting ID: ${product.id} | Code: ${product.default_code || 'N/A'}`);
            await this.odooService.delete('product.template', product.id);
            deletedCount++;
            console.log(`  ✅ Deleted successfully`);
          } catch (error) {
            console.error(`  ❌ Failed to delete ID ${product.id}:`, error.message);
            errorCount++;
          }
        }
      }
    }

    // ลบซ้ำตามรหัส
    for (const [code, products] of Object.entries(duplicates.byCode)) {
      if (products.length > 1) {
        const sortedProducts = this.sortProductsByStrategy(products, keepStrategy);
        const toDelete = sortedProducts.slice(1);

        console.log(`\n🗑️ Deleting duplicates for code "${code}":`);
        for (const product of toDelete) {
          try {
            console.log(`  Deleting ID: ${product.id} | Name: ${product.name}`);
            await this.odooService.delete('product.template', product.id);
            deletedCount++;
            console.log(`  ✅ Deleted successfully`);
          } catch (error) {
            console.error(`  ❌ Failed to delete ID ${product.id}:`, error.message);
            errorCount++;
          }
        }
      }
    }

    console.log('\n📊 DELETION SUMMARY:');
    console.log(`✅ Successfully deleted: ${deletedCount} products`);
    console.log(`❌ Failed to delete: ${errorCount} products`);

    return { deletedCount, errorCount };
  }

  // 📋 เรียงลำดับสินค้าตามกลยุทธ์
  sortProductsByStrategy(products, strategy) {
    switch (strategy) {
      case 'newest':
        return products.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));
      case 'oldest':
        return products.sort((a, b) => new Date(a.create_date) - new Date(b.create_date));
      case 'highest_price':
        return products.sort((a, b) => (b.list_price || 0) - (a.list_price || 0));
      case 'lowest_price':
        return products.sort((a, b) => (a.list_price || 0) - (b.list_price || 0));
      default:
        return products;
    }
  }

  // 🔍 ตรวจสอบหมวดหมู่ทั้งหมด
  async getAllCategories() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }
    try {
      console.log('🔍 Fetching all product categories...');
      const categories = await this.odooService.search('product.category', [], [
        'id', 'name', 'parent_id', 'complete_name', 'create_date'
      ], 500);
      return categories;
    } catch (error) {
      console.error('❌ Error fetching categories:', error.message);
      return [];
    }
  }

  // 🔍 ตรวจสอบ category ที่ซ้ำ (ชื่อ+parent)
  findCategoryDuplicates(categories) {
    console.log('🔍 Analyzing categories for duplicates...');
    const duplicates = {};
    categories.forEach(cat => {
      const name = cat.name?.toLowerCase().trim();
      const parentId = cat.parent_id?.[0] || 0;
      const key = `${name}_${parentId}`;
      if (!duplicates[key]) duplicates[key] = [];
      duplicates[key].push(cat);
    });
    return duplicates;
  }

  // 📊 แสดงผล category ที่ซ้ำ
  displayCategoryDuplicates(duplicates) {
    console.log('\n📊 CATEGORY DUPLICATE ANALYSIS');
    let totalGroups = 0, totalItems = 0;
    Object.entries(duplicates).forEach(([key, cats]) => {
      if (cats.length > 1) {
        totalGroups++;
        totalItems += cats.length - 1;
        const [name, parentId] = key.split('_');
        const parent = cats[0].parent_id?.[1] || 'No Parent';
        console.log(`\n📝 "${name}" (parent: ${parent}) (${cats.length} items):`);
        cats.forEach((cat, i) => {
          console.log(`  ${i+1}. ID: ${cat.id} | Complete: ${cat.complete_name}`);
        });
      }
    });
    console.log(`\nTotal duplicate category groups: ${totalGroups}`);
    console.log(`Total duplicate categories: ${totalItems}`);
    return { totalGroups, totalItems };
  }

  // 🗑️ ลบ category ที่ซ้ำ (เก็บใหม่สุด)
  async deleteCategoryDuplicates(duplicates, keepStrategy = 'newest') {
    let deleted = 0, error = 0;
    for (const cats of Object.values(duplicates)) {
      if (cats.length > 1) {
        const sorted = cats.sort((a, b) => new Date(b.create_date) - new Date(a.create_date));
        const toDelete = sorted.slice(1);
        for (const cat of toDelete) {
          try {
            console.log(`  Deleting category ID: ${cat.id} | ${cat.complete_name}`);
            await this.odooService.delete('product.category', cat.id);
            deleted++;
          } catch (e) {
            console.error(`  ❌ Failed to delete category ID ${cat.id}:`, e.message);
            error++;
          }
        }
      }
    }
    console.log(`\n✅ Deleted ${deleted} duplicate categories, failed: ${error}`);
    return { deleted, error };
  }

  // 🚀 รันการตรวจสอบทั้งหมด (เพิ่ม category)
  async runFullCheck(deleteDuplicates = false, keepStrategy = 'newest') {
    console.log('🔍 JAPANESE RESTAURANT PRODUCT DUPLICATE CHECKER');
    console.log('='.repeat(60));
    if (!this.isAuthenticated) {
      const authResult = await this.authenticate();
      if (!authResult.success) {
        console.error('❌ Authentication failed');
        return;
      }
    }
    // สินค้า
    const products = await this.getAllProducts();
    if (products.length === 0) {
      console.log('❌ No products found');
    } else {
      console.log(`📦 Found ${products.length} products`);
      const duplicates = this.findDuplicates(products);
      const summary = this.displayDuplicates(duplicates);
      if (deleteDuplicates && summary.totalDuplicates > 0) {
        console.log('\n⚠️ WARNING: This will permanently delete duplicate products!');
        await new Promise(resolve => setTimeout(resolve, 5000));
        await this.deleteDuplicates(duplicates, keepStrategy);
      }
    }
    // หมวดหมู่
    const categories = await this.getAllCategories();
    if (categories.length === 0) {
      console.log('❌ No categories found');
    } else {
      console.log(`📦 Found ${categories.length} categories`);
      const catDuplicates = this.findCategoryDuplicates(categories);
      const catSummary = this.displayCategoryDuplicates(catDuplicates);
      if (deleteDuplicates && catSummary.totalItems > 0) {
        console.log('\n⚠️ WARNING: This will permanently delete duplicate categories!');
        await new Promise(resolve => setTimeout(resolve, 5000));
        await this.deleteCategoryDuplicates(catDuplicates, keepStrategy);
      }
    }
  }
}

// Export
module.exports = DuplicateProductChecker;

// Run if called directly
if (require.main === module) {
  const checker = new DuplicateProductChecker();
  
  const args = process.argv.slice(2);
  const deleteDuplicates = args.includes('--delete');
  const keepStrategy = args.find(arg => arg.startsWith('--keep='))?.split('=')[1] || 'newest';
  
  checker.runFullCheck(deleteDuplicates, keepStrategy).catch(console.error);
} 