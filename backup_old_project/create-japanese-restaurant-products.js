const OdooService = require('./src/services/odoo.service');

class JapaneseRestaurantProducts {
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

  // 🍣 สร้าง Product Categories สำหรับร้านอาหารญี่ปุ่น
  async createProductCategories() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    const categories = [
      // 🍣 อาหารหลัก (Main Dishes)
      {
        name: '🍣 Sushi & Sashimi',
        parent_id: 4 // Food category
      },
      {
        name: '🍜 Noodles & Ramen',
        parent_id: 4
      },
      {
        name: '🍱 Bento & Rice Dishes',
        parent_id: 4
      },
      {
        name: '🍖 Grilled & BBQ',
        parent_id: 4
      },
      {
        name: '🥘 Hot Pot & Soup',
        parent_id: 4
      },
      {
        name: '🥗 Appetizers & Salads',
        parent_id: 4
      },
      {
        name: '🍰 Desserts & Sweets',
        parent_id: 4
      },
      {
        name: '🥤 Beverages & Drinks',
        parent_id: 4
      },
      {
        name: '🍶 Sake & Alcohol',
        parent_id: 4
      },
      {
        name: '🍵 Tea & Coffee',
        parent_id: 4
      },
      {
        name: '🥢 Condiments & Sauces',
        parent_id: 4
      },
      {
        name: '🍽️ Tableware & Equipment',
        parent_id: 1 // Goods category
      },
      {
        name: '🧹 Cleaning & Maintenance',
        parent_id: 1
      },
      {
        name: '👕 Staff Uniforms',
        parent_id: 1
      },
      {
        name: '📦 Packaging & Takeaway',
        parent_id: 1
      }
    ];

    console.log('🍣 Creating Japanese Restaurant Product Categories...');
    
    const createdCategories = [];
    
    for (const category of categories) {
      try {
        console.log(`📁 Creating category: ${category.name}`);
        const categoryId = await this.odooService.create('product.category', category);
        createdCategories.push({ id: categoryId, name: category.name });
        console.log(`✅ Created category: ${category.name} (ID: ${categoryId})`);
      } catch (error) {
        console.log(`❌ Failed to create category ${category.name}: ${error.message}`);
      }
    }

    return createdCategories;
  }

  // 🍣 สร้าง Products สำหรับร้านอาหารญี่ปุ่น
  async createProducts() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    // ข้อมูล Products แยกตามหมวดหมู่
    const products = {
      '🍣 Sushi & Sashimi': [
        { name: 'ซูชิแซลมอน', list_price: 120, standard_price: 80, default_code: 'SUSHI_SALMON' },
        { name: 'ซูชิทูน่า', list_price: 100, standard_price: 70, default_code: 'SUSHI_TUNA' },
        { name: 'ซูชิไข่กุ้ง', list_price: 90, standard_price: 60, default_code: 'SUSHI_SHRIMP' },
        { name: 'ซาชิมิแซลมอน', list_price: 180, standard_price: 120, default_code: 'SASHIMI_SALMON' },
        { name: 'ซาชิมิทูน่า', list_price: 160, standard_price: 110, default_code: 'SASHIMI_TUNA' },
        { name: 'ซาชิมิไข่กุ้ง', list_price: 140, standard_price: 95, default_code: 'SASHIMI_SHRIMP' },
        { name: 'โรลแคลิฟอร์เนีย', list_price: 150, standard_price: 100, default_code: 'CALIFORNIA_ROLL' },
        { name: 'โรลฟิลาเดลเฟีย', list_price: 160, standard_price: 105, default_code: 'PHILADELPHIA_ROLL' },
        { name: 'โรลสไปซี่ทูน่า', list_price: 140, standard_price: 90, default_code: 'SPICY_TUNA_ROLL' },
        { name: 'โรลแซลมอนอโวคาโด', list_price: 170, standard_price: 115, default_code: 'SALMON_AVOCADO_ROLL' }
      ],
      '🍜 Noodles & Ramen': [
        { name: 'ราเมนชิโอ', list_price: 180, standard_price: 120, default_code: 'RAMEN_SHIO' },
        { name: 'ราเมนโชยุ', list_price: 190, standard_price: 125, default_code: 'RAMEN_SHOYU' },
        { name: 'ราเมนมิโซะ', list_price: 200, standard_price: 130, default_code: 'RAMEN_MISO' },
        { name: 'ราเมนทงคัตสึ', list_price: 220, standard_price: 145, default_code: 'RAMEN_TONKOTSU' },
        { name: 'อุด้งซุปชิโอ', list_price: 160, standard_price: 105, default_code: 'UDON_SHIO' },
        { name: 'อุด้งซุปโชยุ', list_price: 170, standard_price: 110, default_code: 'UDON_SHOYU' },
        { name: 'โซบะเย็น', list_price: 150, standard_price: 95, default_code: 'SOBA_COLD' },
        { name: 'โซบะร้อน', list_price: 160, standard_price: 100, default_code: 'SOBA_HOT' },
        { name: 'ยาคิโซบะ', list_price: 140, standard_price: 90, default_code: 'YAKI_SOBA' },
        { name: 'ยาคิอุด้ง', list_price: 150, standard_price: 95, default_code: 'YAKI_UDON' }
      ],
      '🍱 Bento & Rice Dishes': [
        { name: 'เบนโตะไก่เทริยากิ', list_price: 200, standard_price: 130, default_code: 'BENTO_CHICKEN_TERIYAKI' },
        { name: 'เบนโตะปลาแซลมอน', list_price: 220, standard_price: 145, default_code: 'BENTO_SALMON' },
        { name: 'เบนโตะหมูทงคัตสึ', list_price: 210, standard_price: 140, default_code: 'BENTO_TONKATSU' },
        { name: 'เบนโตะเนื้อวากิว', list_price: 350, standard_price: 250, default_code: 'BENTO_WAGYU' },
        { name: 'ข้าวไก่เทริยากิ', list_price: 150, standard_price: 95, default_code: 'RICE_CHICKEN_TERIYAKI' },
        { name: 'ข้าวปลาแซลมอน', list_price: 170, standard_price: 110, default_code: 'RICE_SALMON' },
        { name: 'ข้าวหมูทงคัตสึ', list_price: 160, standard_price: 100, default_code: 'RICE_TONKATSU' },
        { name: 'ข้าวเนื้อวากิว', list_price: 300, standard_price: 200, default_code: 'RICE_WAGYU' },
        { name: 'ข้าวไข่เจียวญี่ปุ่น', list_price: 120, standard_price: 75, default_code: 'RICE_TAMAGO' },
        { name: 'ข้าวแกงกะหรี่ญี่ปุ่น', list_price: 140, standard_price: 90, default_code: 'RICE_CURRY' }
      ],
      '🍖 Grilled & BBQ': [
        { name: 'ยากิโทริ (ไก่ย่าง)', list_price: 120, standard_price: 75, default_code: 'YAKITORI_CHICKEN' },
        { name: 'ยากิโทริหมู', list_price: 130, standard_price: 80, default_code: 'YAKITORI_PORK' },
        { name: 'ยากิโทริเนื้อ', list_price: 150, standard_price: 95, default_code: 'YAKITORI_BEEF' },
        { name: 'ยากิโทริกุ้ง', list_price: 140, standard_price: 85, default_code: 'YAKITORI_SHRIMP' },
        { name: 'ยากิโทริเห็ด', list_price: 100, standard_price: 60, default_code: 'YAKITORI_MUSHROOM' },
        { name: 'ไก่เทริยากิ', list_price: 180, standard_price: 115, default_code: 'CHICKEN_TERIYAKI' },
        { name: 'ปลาแซลมอนเทริยากิ', list_price: 200, standard_price: 130, default_code: 'SALMON_TERIYAKI' },
        { name: 'หมูทงคัตสึ', list_price: 190, standard_price: 120, default_code: 'PORK_TONKATSU' },
        { name: 'เนื้อวากิวย่าง', list_price: 400, standard_price: 280, default_code: 'WAGYU_GRILLED' },
        { name: 'ปลาแมคเคอเรลย่าง', list_price: 160, standard_price: 100, default_code: 'MACKEREL_GRILLED' }
      ],
      '🥘 Hot Pot & Soup': [
        { name: 'ชาบูชาบู', list_price: 350, standard_price: 220, default_code: 'SHABU_SHABU' },
        { name: 'สุกิยากิ', list_price: 320, standard_price: 200, default_code: 'SUKIYAKI' },
        { name: 'นาเบะ', list_price: 280, standard_price: 180, default_code: 'NABE' },
        { name: 'มิโซะซุป', list_price: 80, standard_price: 50, default_code: 'MISO_SOUP' },
        { name: 'ซุปชิโอ', list_price: 70, standard_price: 45, default_code: 'SHIO_SOUP' },
        { name: 'ซุปโชยุ', list_price: 75, standard_price: 48, default_code: 'SHOYU_SOUP' },
        { name: 'ซุปทงคัตสึ', list_price: 90, standard_price: 55, default_code: 'TONKOTSU_SOUP' },
        { name: 'ซุปเห็ดชิตาเกะ', list_price: 85, standard_price: 52, default_code: 'SHIITAKE_SOUP' },
        { name: 'ซุปสาหร่ายวาคาเมะ', list_price: 80, standard_price: 50, default_code: 'WAKAME_SOUP' },
        { name: 'ซุปไข่', list_price: 75, standard_price: 45, default_code: 'EGG_SOUP' }
      ],
      '🥗 Appetizers & Salads': [
        { name: 'เอดามาเมะ', list_price: 80, standard_price: 50, default_code: 'EDAMAME' },
        { name: 'กากิ (หอยนางรม)', list_price: 120, standard_price: 75, default_code: 'KAKI_OYSTER' },
        { name: 'ทาโกะยากิ', list_price: 100, standard_price: 60, default_code: 'TAKOYAKI' },
        { name: 'เกียวซ่า', list_price: 110, standard_price: 65, default_code: 'GYOZA' },
        { name: 'สลัดสาหร่ายวาคาเมะ', list_price: 90, standard_price: 55, default_code: 'WAKAME_SALAD' },
        { name: 'สลัดไข่ปลา', list_price: 100, standard_price: 60, default_code: 'TOBIKO_SALAD' },
        { name: 'สลัดแซลมอน', list_price: 130, standard_price: 80, default_code: 'SALMON_SALAD' },
        { name: 'สลัดทูน่า', list_price: 120, standard_price: 75, default_code: 'TUNA_SALAD' },
        { name: 'สลัดไข่กุ้ง', list_price: 110, standard_price: 65, default_code: 'SHRIMP_SALAD' },
        { name: 'สลัดเห็ดชิตาเกะ', list_price: 95, standard_price: 55, default_code: 'SHIITAKE_SALAD' }
      ],
      '🍰 Desserts & Sweets': [
        { name: 'โมจิ', list_price: 60, standard_price: 35, default_code: 'MOCHI' },
        { name: 'ไอศกรีมชาเขียว', list_price: 80, standard_price: 45, default_code: 'GREEN_TEA_ICE_CREAM' },
        { name: 'ไอศกรีมสตรอเบอร์รี่', list_price: 80, standard_price: 45, default_code: 'STRAWBERRY_ICE_CREAM' },
        { name: 'ไอศกรีมวานิลลา', list_price: 75, standard_price: 40, default_code: 'VANILLA_ICE_CREAM' },
        { name: 'ไอศกรีมช็อกโกแลต', list_price: 85, standard_price: 50, default_code: 'CHOCOLATE_ICE_CREAM' },
        { name: 'ไอศกรีมแดง', list_price: 80, standard_price: 45, default_code: 'RED_BEAN_ICE_CREAM' },
        { name: 'ไอศกรีมดำ', list_price: 80, standard_price: 45, default_code: 'BLACK_SESAME_ICE_CREAM' },
        { name: 'ไอศกรีมชาเขียว', list_price: 80, standard_price: 45, default_code: 'MATCHA_ICE_CREAM' },
        { name: 'ไอศกรีมส้ม', list_price: 80, standard_price: 45, default_code: 'YUZU_ICE_CREAM' },
        { name: 'ไอศกรีมชาเขียว', list_price: 80, standard_price: 45, default_code: 'HOUJICHA_ICE_CREAM' }
      ],
      '🥤 Beverages & Drinks': [
        { name: 'น้ำส้มคั้น', list_price: 60, standard_price: 35, default_code: 'ORANGE_JUICE' },
        { name: 'น้ำแอปเปิ้ล', list_price: 60, standard_price: 35, default_code: 'APPLE_JUICE' },
        { name: 'น้ำองุ่น', list_price: 65, standard_price: 38, default_code: 'GRAPE_JUICE' },
        { name: 'น้ำมะพร้าว', list_price: 70, standard_price: 40, default_code: 'COCONUT_WATER' },
        { name: 'น้ำมะนาว', list_price: 55, standard_price: 30, default_code: 'LEMONADE' },
        { name: 'น้ำมะพร้าว', list_price: 70, standard_price: 40, default_code: 'COCONUT_JUICE' },
        { name: 'น้ำสตรอเบอร์รี่', list_price: 65, standard_price: 38, default_code: 'STRAWBERRY_JUICE' },
        { name: 'น้ำบลูเบอร์รี่', list_price: 70, standard_price: 40, default_code: 'BLUEBERRY_JUICE' },
        { name: 'น้ำแครนเบอร์รี่', list_price: 65, standard_price: 38, default_code: 'CRANBERRY_JUICE' },
        { name: 'น้ำทับทิม', list_price: 75, standard_price: 45, default_code: 'POMEGRANATE_JUICE' }
      ],
      '🍶 Sake & Alcohol': [
        { name: 'สาเกร้อน', list_price: 120, standard_price: 70, default_code: 'SAKE_HOT' },
        { name: 'สาเกเย็น', list_price: 130, standard_price: 75, default_code: 'SAKE_COLD' },
        { name: 'เบียร์อาซาฮี', list_price: 100, standard_price: 55, default_code: 'ASAHI_BEER' },
        { name: 'เบียร์คิริน', list_price: 100, standard_price: 55, default_code: 'KIRIN_BEER' },
        { name: 'เบียร์ซัปโปโร', list_price: 100, standard_price: 55, default_code: 'SAPPORO_BEER' },
        { name: 'เบียร์ยอนชู', list_price: 100, standard_price: 55, default_code: 'YONSHU_BEER' },
        { name: 'เบียร์ออริออน', list_price: 100, standard_price: 55, default_code: 'ORION_BEER' },
        { name: 'เบียร์ซันโตรี่', list_price: 100, standard_price: 55, default_code: 'SUNTORY_BEER' },
        { name: 'เบียร์นิกกะ', list_price: 100, standard_price: 55, default_code: 'NIKKA_BEER' },
        { name: 'เบียร์ยามาฮะ', list_price: 100, standard_price: 55, default_code: 'YAMAHA_BEER' }
      ],
      '🍵 Tea & Coffee': [
        { name: 'ชาเขียว', list_price: 50, standard_price: 25, default_code: 'GREEN_TEA' },
        { name: 'ชาแดง', list_price: 50, standard_price: 25, default_code: 'RED_TEA' },
        { name: 'ชาดำ', list_price: 50, standard_price: 25, default_code: 'BLACK_TEA' },
        { name: 'ชาอูหลง', list_price: 55, standard_price: 28, default_code: 'OOLONG_TEA' },
        { name: 'ชาเขียว', list_price: 60, standard_price: 30, default_code: 'MATCHA_TEA' },
        { name: 'ชาเขียว', list_price: 55, standard_price: 28, default_code: 'HOUJICHA_TEA' },
        { name: 'ชาเขียว', list_price: 55, standard_price: 28, default_code: 'GENMAICHA_TEA' },
        { name: 'ชาเขียว', list_price: 55, standard_price: 28, default_code: 'KUKICHA_TEA' },
        { name: 'กาแฟดำ', list_price: 60, standard_price: 30, default_code: 'BLACK_COFFEE' },
        { name: 'กาแฟใส่นม', list_price: 70, standard_price: 35, default_code: 'COFFEE_WITH_MILK' }
      ],
      '🥢 Condiments & Sauces': [
        { name: 'ซอสโชยุ', list_price: 30, standard_price: 15, default_code: 'SHOYU_SAUCE' },
        { name: 'ซอสวาซาบิ', list_price: 25, standard_price: 12, default_code: 'WASABI_SAUCE' },
        { name: 'ซอสเทริยากิ', list_price: 35, standard_price: 18, default_code: 'TERIYAKI_SAUCE' },
        { name: 'ซอสพอนซุ', list_price: 30, standard_price: 15, default_code: 'PONZU_SAUCE' },
        { name: 'ซอสโกมะ', list_price: 25, standard_price: 12, default_code: 'GOMA_SAUCE' },
        { name: 'ซอสยูซุ', list_price: 35, standard_price: 18, default_code: 'YUZU_SAUCE' },
        { name: 'ซอสมิโซะ', list_price: 30, standard_price: 15, default_code: 'MISO_SAUCE' },
        { name: 'ซอสทาเร', list_price: 25, standard_price: 12, default_code: 'TARE_SAUCE' },
        { name: 'ซอสสไปซี่', list_price: 30, standard_price: 15, default_code: 'SPICY_SAUCE' },
        { name: 'ซอสสวีท', list_price: 25, standard_price: 12, default_code: 'SWEET_SAUCE' }
      ]
    };

    console.log('🍣 Creating Japanese Restaurant Products...');
    
    const createdProducts = [];
    
    // หา category IDs
    const categories = await this.odooService.search('product.category', [], ['name', 'id'], 100);
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    for (const [categoryName, productList] of Object.entries(products)) {
      const categoryId = categoryMap[categoryName];
      if (!categoryId) {
        console.log(`⚠️ Category not found: ${categoryName}`);
        continue;
      }

      console.log(`\n📦 Creating products for category: ${categoryName}`);
      
      for (const product of productList) {
        try {
          const productData = {
            name: product.name,
            list_price: product.list_price,
            standard_price: product.standard_price,
            default_code: product.default_code,
            categ_id: categoryId,
            type: 'consu',
            purchase_ok: true,
            sale_ok: true,
            weight: 0.1,
            volume: 0.001
          };

          console.log(`🍣 Creating product: ${product.name}`);
          const productId = await this.odooService.create('product.template', productData);
          createdProducts.push({ 
            id: productId, 
            name: product.name, 
            category: categoryName,
            price: product.list_price 
          });
          console.log(`✅ Created product: ${product.name} (ID: ${productId})`);
        } catch (error) {
          console.log(`❌ Failed to create product ${product.name}: ${error.message}`);
        }
      }
    }

    return createdProducts;
  }

  // 🍣 สร้าง Products สำหรับอุปกรณ์และเครื่องใช้
  async createEquipmentProducts() {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    const equipmentProducts = {
      '🍽️ Tableware & Equipment': [
        { name: 'ชามซุป', list_price: 150, standard_price: 80, default_code: 'SOUP_BOWL' },
        { name: 'จานข้าว', list_price: 120, standard_price: 60, default_code: 'RICE_BOWL' },
        { name: 'จานรอง', list_price: 80, standard_price: 40, default_code: 'SIDE_PLATE' },
        { name: 'ช้อนส้อม', list_price: 50, standard_price: 25, default_code: 'SPOON_FORK' },
        { name: 'ตะเกียบ', list_price: 30, standard_price: 15, default_code: 'CHOPSTICKS' },
        { name: 'แก้วน้ำ', list_price: 60, standard_price: 30, default_code: 'WATER_GLASS' },
        { name: 'แก้วไวน์', list_price: 80, standard_price: 40, default_code: 'WINE_GLASS' },
        { name: 'แก้วเบียร์', list_price: 70, standard_price: 35, default_code: 'BEER_GLASS' },
        { name: 'ถาดเสิร์ฟ', list_price: 200, standard_price: 100, default_code: 'SERVING_TRAY' },
        { name: 'หม้อซุป', list_price: 500, standard_price: 250, default_code: 'SOUP_POT' }
      ],
      '🧹 Cleaning & Maintenance': [
        { name: 'น้ำยาล้างจาน', list_price: 120, standard_price: 60, default_code: 'DISH_SOAP' },
        { name: 'ผ้าเช็ดโต๊ะ', list_price: 80, standard_price: 40, default_code: 'TABLE_CLOTH' },
        { name: 'ผ้าเช็ดจาน', list_price: 60, standard_price: 30, default_code: 'DISH_CLOTH' },
        { name: 'น้ำยาทำความสะอาดพื้น', list_price: 150, standard_price: 75, default_code: 'FLOOR_CLEANER' },
        { name: 'น้ำยาทำความสะอาดห้องน้ำ', list_price: 130, standard_price: 65, default_code: 'BATHROOM_CLEANER' },
        { name: 'ถุงขยะ', list_price: 100, standard_price: 50, default_code: 'GARBAGE_BAG' },
        { name: 'ถุงมือยาง', list_price: 90, standard_price: 45, default_code: 'RUBBER_GLOVES' },
        { name: 'แปรงล้างจาน', list_price: 70, standard_price: 35, default_code: 'DISH_BRUSH' },
        { name: 'ไม้กวาด', list_price: 120, standard_price: 60, default_code: 'BROOM' },
        { name: 'ที่โกยขยะ', list_price: 100, standard_price: 50, default_code: 'DUSTPAN' }
      ],
      '👕 Staff Uniforms': [
        { name: 'เสื้อเชฟ', list_price: 800, standard_price: 400, default_code: 'CHEF_JACKET' },
        { name: 'กางเกงเชฟ', list_price: 600, standard_price: 300, default_code: 'CHEF_PANTS' },
        { name: 'หมวกเชฟ', list_price: 200, standard_price: 100, default_code: 'CHEF_HAT' },
        { name: 'เสื้อเสิร์ฟ', list_price: 500, standard_price: 250, default_code: 'WAITER_SHIRT' },
        { name: 'กางเกงเสิร์ฟ', list_price: 400, standard_price: 200, default_code: 'WAITER_PANTS' },
        { name: 'ผ้ากันเปื้อน', list_price: 300, standard_price: 150, default_code: 'APRON' },
        { name: 'รองเท้าเชฟ', list_price: 1200, standard_price: 600, default_code: 'CHEF_SHOES' },
        { name: 'รองเท้าเสิร์ฟ', list_price: 800, standard_price: 400, default_code: 'WAITER_SHOES' },
        { name: 'ถุงมือทำอาหาร', list_price: 150, standard_price: 75, default_code: 'COOKING_GLOVES' },
        { name: 'ผ้าผูกคอ', list_price: 100, standard_price: 50, default_code: 'NECKTIE' }
      ],
      '📦 Packaging & Takeaway': [
        { name: 'กล่องเบนโตะ', list_price: 15, standard_price: 8, default_code: 'BENTO_BOX' },
        { name: 'ถุงกระดาษ', list_price: 5, standard_price: 2, default_code: 'PAPER_BAG' },
        { name: 'ถุงพลาสติก', list_price: 3, standard_price: 1, default_code: 'PLASTIC_BAG' },
        { name: 'กล่องกระดาษ', list_price: 10, standard_price: 5, default_code: 'CARDBOARD_BOX' },
        { name: 'ถ้วยกระดาษ', list_price: 8, standard_price: 4, default_code: 'PAPER_CUP' },
        { name: 'ฝาถ้วยกระดาษ', list_price: 5, standard_price: 2, default_code: 'PAPER_CUP_LID' },
        { name: 'หลอดดูด', list_price: 2, standard_price: 1, default_code: 'STRAW' },
        { name: 'ช้อนพลาสติก', list_price: 3, standard_price: 1, default_code: 'PLASTIC_SPOON' },
        { name: 'ส้อมพลาสติก', list_price: 3, standard_price: 1, default_code: 'PLASTIC_FORK' },
        { name: 'ตะเกียบไม้', list_price: 4, standard_price: 2, default_code: 'WOODEN_CHOPSTICKS' }
      ]
    };

    console.log('🍽️ Creating Equipment Products...');
    
    const createdEquipment = [];
    
    // หา category IDs
    const categories = await this.odooService.search('product.category', [], ['name', 'id'], 100);
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    for (const [categoryName, productList] of Object.entries(equipmentProducts)) {
      const categoryId = categoryMap[categoryName];
      if (!categoryId) {
        console.log(`⚠️ Category not found: ${categoryName}`);
        continue;
      }

      console.log(`\n📦 Creating equipment for category: ${categoryName}`);
      
      for (const product of productList) {
        try {
          const productData = {
            name: product.name,
            list_price: product.list_price,
            standard_price: product.standard_price,
            default_code: product.default_code,
            categ_id: categoryId,
            type: 'consu',
            purchase_ok: true,
            sale_ok: false,
            weight: 0.5,
            volume: 0.005
          };

          console.log(`🍽️ Creating equipment: ${product.name}`);
          const productId = await this.odooService.create('product.template', productData);
          createdEquipment.push({ 
            id: productId, 
            name: product.name, 
            category: categoryName,
            price: product.list_price 
          });
          console.log(`✅ Created equipment: ${product.name} (ID: ${productId})`);
        } catch (error) {
          console.log(`❌ Failed to create equipment ${product.name}: ${error.message}`);
        }
      }
    }

    return createdEquipment;
  }

  // 🍣 สร้างเฉพาะอุปกรณ์
  async createEquipmentOnly() {
    console.log('🍽️ Creating Equipment Products Only...');
    console.log('='.repeat(60));
    
    const equipmentProducts = await this.createEquipmentProducts();
    console.log(`✅ Created ${equipmentProducts.length} equipment products`);
    
    return equipmentProducts;
  }

  // 🍣 สร้างทั้งหมด
  async createAll() {
    console.log('🍣 Starting Japanese Restaurant Product Creation...');
    console.log('='.repeat(60));
    
    // สร้าง Categories
    console.log('\n📁 Step 1: Creating Product Categories');
    const categories = await this.createProductCategories();
    console.log(`✅ Created ${categories.length} categories`);
    
    // สร้าง Food Products
    console.log('\n🍣 Step 2: Creating Food Products');
    const foodProducts = await this.createProducts();
    console.log(`✅ Created ${foodProducts.length} food products`);
    
    // สร้าง Equipment Products
    console.log('\n🍽️ Step 3: Creating Equipment Products');
    const equipmentProducts = await this.createEquipmentProducts();
    console.log(`✅ Created ${equipmentProducts.length} equipment products`);
    
    // สรุป
    console.log('\n🎯 Summary:');
    console.log('='.repeat(60));
    console.log(`📁 Categories: ${categories.length}`);
    console.log(`🍣 Food Products: ${foodProducts.length}`);
    console.log(`🍽️ Equipment Products: ${equipmentProducts.length}`);
    console.log(`📊 Total Products: ${foodProducts.length + equipmentProducts.length}`);
    
    return {
      categories,
      foodProducts,
      equipmentProducts,
      total: foodProducts.length + equipmentProducts.length
    };
  }
}

// Export
module.exports = JapaneseRestaurantProducts;

// Run if called directly
if (require.main === module) {
  const creator = new JapaneseRestaurantProducts();
  
  // ตรวจสอบ argument เพื่อเลือกโหมดการทำงาน
  const args = process.argv.slice(2);
  
  if (args.includes('--equipment-only')) {
    creator.createEquipmentOnly().catch(console.error);
  } else {
    creator.createAll().catch(console.error);
  }
} 