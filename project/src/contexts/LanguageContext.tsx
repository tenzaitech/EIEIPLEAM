import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'th' | 'en' | 'my';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  th: {
    // Navigation
    'nav.dashboard': 'หน้าหลัก',
    'nav.products': 'สินค้า',
    'nav.suppliers': 'ผู้จำหน่าย',
    'nav.purchase-request': 'ใบขอซื้อ',
    'nav.purchase-order': 'ใบสั่งซื้อ',
    'nav.goods-receipt': 'รับสินค้า',
    'nav.inventory': 'คลังสินค้า',
    'nav.storage': 'จัดเก็บ',
    'nav.processing': 'แปรรูป',
    'nav.transportation': 'ขนส่ง',
    'nav.reports': 'รายงาน',
    
    // Common
    'common.search': 'ค้นหา',
    'common.filter': 'กรอง',
    'common.add': 'เพิ่ม',
    'common.edit': 'แก้ไข',
    'common.delete': 'ลบ',
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.submit': 'ส่ง',
    'common.export': 'ส่งออก',
    'common.import': 'นำเข้า',
    'common.view': 'ดู',
    'common.status': 'สถานะ',
    'common.date': 'วันที่',
    'common.amount': 'จำนวนเงิน',
    'common.quantity': 'จำนวน',
    'common.price': 'ราคา',
    'common.total': 'รวม',
    'common.name': 'ชื่อ',
    'common.description': 'รายละเอียด',
    'common.active': 'ใช้งาน',
    'common.inactive': 'ไม่ใช้งาน',
    'common.loading': 'กำลังโหลด...',
    'common.no-data': 'ไม่มีข้อมูล',
    
    // Dashboard
    'dashboard.title': 'หน้าหลัก',
    'dashboard.subtitle': 'ยินดีต้อนรับ! นี่คือสถานการณ์ของธุรกิจคุณในวันนี้',
    'dashboard.total-revenue': 'รายได้รวม',
    'dashboard.purchase-orders': 'ใบสั่งซื้อ',
    'dashboard.inventory-items': 'รายการสินค้า',
    'dashboard.shipments': 'การจัดส่ง',
    'dashboard.revenue-trend': 'แนวโน้มรายได้',
    'dashboard.order-status': 'สถานะคำสั่งซื้อ',
    'dashboard.recent-orders': 'คำสั่งซื้อล่าสุด',
    
    // Products
    'products.title': 'จัดการสินค้า',
    'products.subtitle': 'จัดการสินค้าและรายการเมนูของร้านอาหาร',
    'products.add-product': 'เพิ่มสินค้า',
    'products.total-products': 'สินค้าทั้งหมด',
    'products.raw-materials': 'วัตถุดิบ',
    'products.finished-products': 'สินค้าสำเร็จรูป',
    'products.low-stock': 'สินค้าใกล้หมด',
    'products.product-name': 'ชื่อสินค้า',
    'products.product-code': 'รหัสสินค้า',
    'products.type': 'ประเภท',
    'products.stock': 'สต๊อก',
    'products.pricing': 'ราคา',
    'products.cost-price': 'ราคาทุน',
    'products.list-price': 'ราคาขาย',
    'products.current-stock': 'สต๊อกปัจจุบัน',
    'products.minimum-stock': 'สต๊อกขั้นต่ำ',
    'products.maximum-stock': 'สต๊อกสูงสุด',
    'products.unit-measure': 'หน่วยนับ',
    
    // Suppliers
    'suppliers.title': 'จัดการผู้จำหน่าย',
    'suppliers.subtitle': 'จัดการผู้จำหน่ายและความสัมพันธ์ทางธุรกิจ',
    'suppliers.add-supplier': 'เพิ่มผู้จำหน่าย',
    'suppliers.total-suppliers': 'ผู้จำหน่ายทั้งหมด',
    'suppliers.a-rank': 'ระดับ A',
    'suppliers.active-suppliers': 'ผู้จำหน่ายที่ใช้งาน',
    'suppliers.countries': 'ประเทศ',
    'suppliers.supplier-name': 'ชื่อผู้จำหน่าย',
    'suppliers.email': 'อีเมล',
    'suppliers.phone': 'โทรศัพท์',
    'suppliers.address': 'ที่อยู่',
    'suppliers.city': 'เมือง',
    'suppliers.country': 'ประเทศ',
    'suppliers.zip-code': 'รหัสไปรษณีย์',
    'suppliers.rank': 'ระดับ',
    'suppliers.payment-terms': 'เงื่อนไขการชำระเงิน',
    
    // Status
    'status.pending': 'รอดำเนินการ',
    'status.approved': 'อนุมัติแล้ว',
    'status.delivered': 'จัดส่งแล้ว',
    'status.cancelled': 'ยกเลิก',
    'status.in-stock': 'มีสต๊อก',
    'status.low-stock': 'สต๊อกต่ำ',
    'status.out-of-stock': 'หมดสต๊อก',
    'status.normal': 'ปกติ',
    'status.warning': 'เตือน',
    'status.critical': 'วิกฤต',
    
    // Priority
    'priority.high': 'สูง',
    'priority.medium': 'ปานกลาง',
    'priority.low': 'ต่ำ',
    
    // User
    'user.profile': 'โปรไฟล์',
    'user.settings': 'ตั้งค่า',
    'user.logout': 'ออกจากระบบ',
    
    // Login
    'login.title': 'ยินดีต้อนรับสู่ TENZAI',
    'login.subtitle': 'ระบบจัดการการสั่งซื้อร้านอาหาร',
    'login.email': 'ที่อยู่อีเมล',
    'login.password': 'รหัสผ่าน',
    'login.signin': 'เข้าสู่ระบบ',
    'login.demo-credentials': 'ข้อมูลทดสอบ: admin@tenzai.com / admin123',
    'login.admin-access': 'สิทธิ์ผู้ดูแลระบบ',
    'login.full-control': 'ควบคุมระบบเต็มรูปแบบ',
    'login.role-based': 'ระบบสิทธิ์ตามตำแหน่ง',
    'login.multi-roles': 'จัดซื้อ, คลังสินค้า, ฯลฯ',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.products': 'Products',
    'nav.suppliers': 'Suppliers',
    'nav.purchase-request': 'Purchase Request',
    'nav.purchase-order': 'Purchase Order',
    'nav.goods-receipt': 'Goods Receipt',
    'nav.inventory': 'Inventory',
    'nav.storage': 'Storage',
    'nav.processing': 'Processing',
    'nav.transportation': 'Transportation',
    'nav.reports': 'Reports',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.add': 'Add',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.view': 'View',
    'common.status': 'Status',
    'common.date': 'Date',
    'common.amount': 'Amount',
    'common.quantity': 'Quantity',
    'common.price': 'Price',
    'common.total': 'Total',
    'common.name': 'Name',
    'common.description': 'Description',
    'common.active': 'Active',
    'common.inactive': 'Inactive',
    'common.loading': 'Loading...',
    'common.no-data': 'No data available',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.subtitle': 'Welcome back! Here\'s what\'s happening with your business today.',
    'dashboard.total-revenue': 'Total Revenue',
    'dashboard.purchase-orders': 'Purchase Orders',
    'dashboard.inventory-items': 'Inventory Items',
    'dashboard.shipments': 'Shipments',
    'dashboard.revenue-trend': 'Revenue Trend',
    'dashboard.order-status': 'Order Status',
    'dashboard.recent-orders': 'Recent Purchase Orders',
    
    // Products
    'products.title': 'Product Management',
    'products.subtitle': 'Manage your restaurant inventory and menu items',
    'products.add-product': 'Add Product',
    'products.total-products': 'Total Products',
    'products.raw-materials': 'Raw Materials',
    'products.finished-products': 'Finished Products',
    'products.low-stock': 'Low Stock Items',
    'products.product-name': 'Product Name',
    'products.product-code': 'Product Code',
    'products.type': 'Type',
    'products.stock': 'Stock',
    'products.pricing': 'Pricing',
    'products.cost-price': 'Cost Price',
    'products.list-price': 'List Price',
    'products.current-stock': 'Current Stock',
    'products.minimum-stock': 'Minimum Stock',
    'products.maximum-stock': 'Maximum Stock',
    'products.unit-measure': 'Unit of Measure',
    
    // Suppliers
    'suppliers.title': 'Supplier Management',
    'suppliers.subtitle': 'Manage your restaurant suppliers and vendor relationships',
    'suppliers.add-supplier': 'Add Supplier',
    'suppliers.total-suppliers': 'Total Suppliers',
    'suppliers.a-rank': 'A-Rank Suppliers',
    'suppliers.active-suppliers': 'Active Suppliers',
    'suppliers.countries': 'Countries',
    'suppliers.supplier-name': 'Supplier Name',
    'suppliers.email': 'Email',
    'suppliers.phone': 'Phone',
    'suppliers.address': 'Address',
    'suppliers.city': 'City',
    'suppliers.country': 'Country',
    'suppliers.zip-code': 'ZIP Code',
    'suppliers.rank': 'Rank',
    'suppliers.payment-terms': 'Payment Terms',
    
    // Status
    'status.pending': 'Pending',
    'status.approved': 'Approved',
    'status.delivered': 'Delivered',
    'status.cancelled': 'Cancelled',
    'status.in-stock': 'In Stock',
    'status.low-stock': 'Low Stock',
    'status.out-of-stock': 'Out of Stock',
    'status.normal': 'Normal',
    'status.warning': 'Warning',
    'status.critical': 'Critical',
    
    // Priority
    'priority.high': 'High',
    'priority.medium': 'Medium',
    'priority.low': 'Low',
    
    // User
    'user.profile': 'Profile',
    'user.settings': 'Settings',
    'user.logout': 'Sign out',
    
    // Login
    'login.title': 'Welcome to TENZAI',
    'login.subtitle': 'Restaurant Purchasing System',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.signin': 'Sign In',
    'login.demo-credentials': 'Demo credentials: admin@tenzai.com / admin123',
    'login.admin-access': 'Admin Access',
    'login.full-control': 'Full system control',
    'login.role-based': 'Role-Based',
    'login.multi-roles': 'Purchasing, Warehouse, etc.',
  },
  my: {
    // Navigation
    'nav.dashboard': 'မူလစာမျက်နှာ',
    'nav.products': 'ကုန်ပစ္စည်းများ',
    'nav.suppliers': 'ပေးသွင်းသူများ',
    'nav.purchase-request': 'ဝယ်ယူရန်တောင်းဆိုချက်',
    'nav.purchase-order': 'ဝယ်ယူမှုအမိန့်',
    'nav.goods-receipt': 'ကုန်ပစ္စည်းလက်ခံ',
    'nav.inventory': 'စာရင်းကောက်',
    'nav.storage': 'သိုလှောင်မှု',
    'nav.processing': 'ပြုပြင်ခြင်း',
    'nav.transportation': 'သယ်ယူပို့ဆောင်ရေး',
    'nav.reports': 'အစီရင်ခံစာများ',
    
    // Common
    'common.search': 'ရှာဖွေရန်',
    'common.filter': 'စစ်ထုတ်ရန်',
    'common.add': 'ထည့်ရန်',
    'common.edit': 'တည်းဖြတ်ရန်',
    'common.delete': 'ဖျက်ရန်',
    'common.save': 'သိမ်းရန်',
    'common.cancel': 'ပယ်ဖျက်ရန်',
    'common.submit': 'တင်သွင်းရန်',
    'common.export': 'ထုတ်ယူရန်',
    'common.import': 'တင်သွင်းရန်',
    'common.view': 'ကြည့်ရန်',
    'common.status': 'အခြေအနေ',
    'common.date': 'ရက်စွဲ',
    'common.amount': 'ပမာណ',
    'common.quantity': 'အရေအတွက်',
    'common.price': 'စျေးနှုန်း',
    'common.total': 'စုစုပေါင်း',
    'common.name': 'အမည်',
    'common.description': 'ဖော်ပြချက်',
    'common.active': 'အသုံးပြုနေသော',
    'common.inactive': 'အသုံးမပြုသော',
    'common.loading': 'ဖွင့်နေသည်...',
    'common.no-data': 'ဒေတာမရှိပါ',
    
    // Dashboard
    'dashboard.title': 'မူလစာမျက်နှာ',
    'dashboard.subtitle': 'ပြန်လည်ကြိုဆိုပါသည်! ယနေ့သင့်လုပ်ငန်းနှင့်ပတ်သက်၍ ဖြစ်ပျက်နေသည့်အရာများ',
    'dashboard.total-revenue': 'စုစုပေါင်းဝင်ငွေ',
    'dashboard.purchase-orders': 'ဝယ်ယူမှုအမိန့်များ',
    'dashboard.inventory-items': 'စာရင်းကောက်ပစ္စည်းများ',
    'dashboard.shipments': 'ပို့ဆောင်မှုများ',
    'dashboard.revenue-trend': 'ဝင်ငွေလမ်းကြောင်း',
    'dashboard.order-status': 'အမိန့်အခြေအနေ',
    'dashboard.recent-orders': 'မကြာသေးမီကဝယ်ယူမှုအမိန့်များ',
    
    // Products
    'products.title': 'ကုန်ပစ္စည်းစီမံခန့်ခွဲမှု',
    'products.subtitle': 'သင့်စားသောက်ဆိုင်၏ စာရင်းကောက်နှင့် မီနူးပစ္စည်းများကို စီမံခန့်ခွဲပါ',
    'products.add-product': 'ကုန်ပစ္စည်းထည့်ရန်',
    'products.total-products': 'စုစုပေါင်းကုန်ပစ္စည်းများ',
    'products.raw-materials': 'ကုန်ကြမ်းများ',
    'products.finished-products': 'အပြီးသတ်ကုန်ပစ္စည်းများ',
    'products.low-stock': 'စတော့်နည်းသောပစ္စည်းများ',
    'products.product-name': 'ကုန်ပစ္စည်းအမည်',
    'products.product-code': 'ကုန်ပစ္စည်းကုဒ်',
    'products.type': 'အမျိုးအစား',
    'products.stock': 'စတော့်',
    'products.pricing': 'စျေးနှုန်းသတ်မှတ်ခြင်း',
    'products.cost-price': 'ကုန်ကျစရိတ်',
    'products.list-price': 'ရောင်းစျေး',
    'products.current-stock': 'လက်ရှိစတော့်',
    'products.minimum-stock': 'အနည်းဆုံးစတော့်',
    'products.maximum-stock': 'အများဆုံးစတော့်',
    'products.unit-measure': 'တိုင်းတာမှုယူနစ်',
    
    // Suppliers
    'suppliers.title': 'ပေးသွင်းသူစီမံခန့်ခွဲမှု',
    'suppliers.subtitle': 'သင့်စားသောက်ဆိုင်၏ ပေးသွင်းသူများနှင့် ရောင်းချသူဆက်ဆံရေးများကို စီမံခန့်ခွဲပါ',
    'suppliers.add-supplier': 'ပေးသွင်းသူထည့်ရန်',
    'suppliers.total-suppliers': 'စုစုပေါင်းပေးသွင်းသူများ',
    'suppliers.a-rank': 'A-အဆင့်ပေးသွင်းသူများ',
    'suppliers.active-suppliers': 'အသုံးပြုနေသောပေးသွင်းသူများ',
    'suppliers.countries': 'နိုင်ငံများ',
    'suppliers.supplier-name': 'ပေးသွင်းသူအမည်',
    'suppliers.email': 'အီးမေးလ်',
    'suppliers.phone': 'ဖုန်း',
    'suppliers.address': 'လိပ်စာ',
    'suppliers.city': 'မြို့',
    'suppliers.country': 'နိုင်ငံ',
    'suppliers.zip-code': 'ဇစ်ကုဒ်',
    'suppliers.rank': 'အဆင့်',
    'suppliers.payment-terms': 'ငွေပေးချေမှုစည်းကမ်းများ',
    
    // Status
    'status.pending': 'စောင့်ဆိုင်းနေသော',
    'status.approved': 'အတည်ပြုပြီး',
    'status.delivered': 'ပို့ဆောင်ပြီး',
    'status.cancelled': 'ပယ်ဖျက်ပြီး',
    'status.in-stock': 'စတော့်ရှိသော',
    'status.low-stock': 'စတော့်နည်းသော',
    'status.out-of-stock': 'စတော့်ကုန်သော',
    'status.normal': 'ပုံမှန်',
    'status.warning': 'သတိပေးချက်',
    'status.critical': 'အရေးကြီး',
    
    // Priority
    'priority.high': 'မြင့်',
    'priority.medium': 'အလယ်အလတ်',
    'priority.low': 'နိမ့်',
    
    // User
    'user.profile': 'ပရိုဖိုင်',
    'user.settings': 'ဆက်တင်များ',
    'user.logout': 'ထွက်ရန်',
    
    // Login
    'login.title': 'TENZAI သို့ကြိုဆိုပါသည်',
    'login.subtitle': 'စားသောက်ဆိုင်ဝယ်ယူမှုစနစ်',
    'login.email': 'အီးမေးလ်လိပ်စာ',
    'login.password': 'စကားဝှက်',
    'login.signin': 'ဝင်ရောက်ရန်',
    'login.demo-credentials': 'စမ်းသပ်အချက်အလက်များ: admin@tenzai.com / admin123',
    'login.admin-access': 'အက်ဒမင်ဝင်ရောက်ခွင့်',
    'login.full-control': 'စနစ်အပြည့်အဝထိန်းချုပ်မှု',
    'login.role-based': 'အခန်းကဏ္ဍအခြေခံ',
    'login.multi-roles': 'ဝယ်ယူမှု၊ ကုန်ကျောင်း၊ စသည်',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('tenzai-language');
    return (saved as Language) || 'th';
  });

  useEffect(() => {
    localStorage.setItem('tenzai-language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}