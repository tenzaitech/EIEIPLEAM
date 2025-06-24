import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  ShoppingCart,
  FileText,
  Package2,
  Warehouse,
  Users,
  Truck,
  PieChart,
  Home,
  Menu,
  X,
  Package,
  ChefHat,
  Settings
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  userRole: string;
}

const navigationItems = [
  { name: 'nav.dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'purchasing', 'warehouse', 'processing', 'transport'] },
  { name: 'nav.products', href: '/products', icon: Package, roles: ['admin', 'purchasing', 'warehouse'] },
  { name: 'nav.suppliers', href: '/suppliers', icon: Users, roles: ['admin', 'purchasing'] },
  { name: 'nav.purchase-request', href: '/purchase-request', icon: FileText, roles: ['admin', 'purchasing', 'warehouse'] },
  { name: 'nav.purchase-order', href: '/purchase-order', icon: ShoppingCart, roles: ['admin', 'purchasing'] },
  { name: 'nav.goods-receipt', href: '/goods-receipt', icon: Package2, roles: ['admin', 'purchasing', 'warehouse'] },
  { name: 'nav.inventory', href: '/inventory', icon: BarChart3, roles: ['admin', 'purchasing', 'warehouse'] },
  { name: 'nav.storage', href: '/storage', icon: Warehouse, roles: ['admin', 'warehouse'] },
  { name: 'nav.processing', href: '/processing', icon: ChefHat, roles: ['admin', 'processing', 'warehouse'] },
  { name: 'nav.transportation', href: '/transportation', icon: Truck, roles: ['admin', 'transport', 'warehouse'] },
  { name: 'nav.reports', href: '/reports', icon: PieChart, roles: ['admin', 'purchasing'] },
  { name: 'nav.system-status', href: '/system-status', icon: Settings, roles: ['admin'] },
];

export default function Sidebar({ isOpen, onToggle, userRole }: SidebarProps) {
  const location = useLocation();
  const { t } = useLanguage();

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300 z-40 border-r border-neutral-200 ${
      isOpen ? 'w-72' : 'w-20'
    }`}>
      <div className="flex items-center justify-between p-6 border-b border-neutral-200">
        <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center'}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-xl font-bold text-neutral-900">TENZAI</h1>
              <p className="text-xs text-neutral-500 font-medium">ระบบจัดการการสั่งซื้อ</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <nav className="mt-6 px-3">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3.5 mb-1 text-sm font-medium transition-all duration-200 rounded-xl group ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
              title={!isOpen ? t(item.name) : undefined}
            >
              <Icon className={`w-5 h-5 ${!isOpen && 'mx-auto'} ${
                isActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-600'
              }`} />
              {isOpen && <span className="ml-3">{t(item.name)}</span>}
              {isActive && isOpen && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {isOpen && (
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-4 border border-primary-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-primary-700">TENZAI v1.0.0</p>
                <p className="text-xs text-primary-600">ระบบจัดการร้านอาหาร</p>
              </div>
            </div>
            <div className="text-xs text-primary-600">
              พัฒนาโดยทีม TENZAI
            </div>
          </div>
        </div>
      )}
    </div>
  );
}