import React from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Truck, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import StatCard from '../components/StatCard';
import Chart from '../components/Chart';
import { useLanguage } from '../contexts/LanguageContext';

export default function Dashboard() {
  const { t } = useLanguage();

  const stats = [
    {
      title: t('dashboard.total-revenue'),
      value: '฿3,245,678',
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'primary' as const
    },
    {
      title: t('dashboard.purchase-orders'),
      value: '1,247',
      change: '+8.2%',
      trend: 'up' as const,
      icon: ShoppingCart,
      color: 'secondary' as const
    },
    {
      title: t('dashboard.inventory-items'),
      value: '8,542',
      change: '-2.4%',
      trend: 'down' as const,
      icon: Package,
      color: 'warning' as const
    },
    {
      title: t('dashboard.shipments'),
      value: '324',
      change: '+15.3%',
      trend: 'up' as const,
      icon: Truck,
      color: 'error' as const
    }
  ];

  const recentOrders = [
    { id: 'PO-001', supplier: 'บริษัท ABC จำกัด', amount: '฿78,500', status: 'pending', date: '2025-01-14' },
    { id: 'PO-002', supplier: 'XYZ Trading', amount: '฿45,200', status: 'approved', date: '2025-01-14' },
    { id: 'PO-003', supplier: 'เทคโนโลยี่โซลูชั่น', amount: '฿125,800', status: 'delivered', date: '2025-01-13' },
    { id: 'PO-004', supplier: 'Global Supply', amount: '฿32,100', status: 'pending', date: '2025-01-13' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-secondary-600 bg-secondary-50';
      case 'delivered': return 'text-primary-600 bg-primary-50';
      case 'pending': return 'text-warning-600 bg-warning-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'delivered': return CheckCircle;
      case 'pending': return Clock;
      default: return AlertTriangle;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return t('status.approved');
      case 'delivered': return t('status.delivered');
      case 'pending': return t('status.pending');
      default: return status;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">{t('dashboard.title')}</h1>
        <p className="text-neutral-600 text-lg">{t('dashboard.subtitle')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-neutral-900">{t('dashboard.revenue-trend')}</h3>
            <div className="flex items-center space-x-2 text-sm text-secondary-600 bg-secondary-50 px-3 py-1.5 rounded-full">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5% เดือนนี้</span>
            </div>
          </div>
          <Chart type="line" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-neutral-900">{t('dashboard.order-status')}</h3>
            <div className="flex items-center space-x-2 text-sm text-primary-600 bg-primary-50 px-3 py-1.5 rounded-full">
              <Package className="w-4 h-4" />
              <span>1,247 รายการ</span>
            </div>
          </div>
          <Chart type="doughnut" />
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="p-8 border-b border-neutral-200">
          <h3 className="text-xl font-semibold text-neutral-900">{t('dashboard.recent-orders')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">รหัสคำสั่งซื้อ</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">ผู้จำหน่าย</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">{t('common.amount')}</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">{t('common.status')}</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">{t('common.date')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {recentOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status);
                return (
                  <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm font-semibold text-neutral-900">{order.id}</span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm text-neutral-700">{order.supplier}</span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm font-semibold text-neutral-900">{order.amount}</span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1.5" />
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm text-neutral-500">{order.date}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}