import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Download, Calendar, Filter, FileText } from 'lucide-react';
import Chart from '../components/Chart';

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportTypes = [
    { id: 'overview', name: 'Business Overview', icon: BarChart3 },
    { id: 'inventory', name: 'Inventory Analysis', icon: PieChart },
    { id: 'procurement', name: 'Procurement Report', icon: FileText },
    { id: 'performance', name: 'Performance Metrics', icon: TrendingUp }
  ];

  const kpiData = [
    {
      title: 'Total Revenue',
      value: '$2,456,789',
      change: '+12.5%',
      trend: 'up',
      period: 'vs last month'
    },
    {
      title: 'Purchase Orders',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      period: 'this month'
    },
    {
      title: 'Inventory Turnover',
      value: '4.2x',
      change: '+0.3x',
      trend: 'up',
      period: 'vs last quarter'
    },
    {
      title: 'On-Time Delivery',
      value: '94.5%',
      change: '-1.2%',
      trend: 'down',
      period: 'this month'
    }
  ];

  const topSuppliers = [
    { name: 'ABC Corporation', orders: 45, value: '$125,000', performance: 98 },
    { name: 'Tech Solutions Ltd', orders: 32, value: '$89,500', performance: 95 },
    { name: 'Global Manufacturing', orders: 28, value: '$156,000', performance: 92 },
    { name: 'Office Depot Pro', orders: 24, value: '$45,200', performance: 89 },
    { name: 'Chemical Supplies Inc', orders: 18, value: '$78,900', performance: 96 }
  ];

  const inventoryCategories = [
    { category: 'Office Supplies', value: 35, color: 'bg-primary-500' },
    { category: 'IT Equipment', value: 25, color: 'bg-secondary-500' },
    { category: 'Raw Materials', value: 20, color: 'bg-warning-500' },
    { category: 'Safety Equipment', value: 12, color: 'bg-error-500' },
    { category: 'Laboratory', value: 8, color: 'bg-neutral-500' }
  ];

  const getPerformanceColor = (performance: number) => {
    if (performance >= 95) return 'text-secondary-600 bg-secondary-50';
    if (performance >= 90) return 'text-warning-600 bg-warning-50';
    return 'text-error-600 bg-error-50';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Reports & Analytics</h1>
          <p className="text-neutral-600 mt-2">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-neutral-500" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedReport === report.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">{report.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neutral-600">{kpi.title}</h3>
              <TrendingUp className={`w-4 h-4 ${
                kpi.trend === 'up' ? 'text-secondary-500' : 'text-error-500'
              }`} />
            </div>
            <div className="text-2xl font-bold text-neutral-900 mb-1">{kpi.value}</div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${
                kpi.trend === 'up' ? 'text-secondary-600' : 'text-error-600'
              }`}>
                {kpi.change}
              </span>
              <span className="text-sm text-neutral-500">{kpi.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <select className="text-sm border border-neutral-300 rounded px-2 py-1">
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>
          </div>
          <Chart type="line" />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Inventory Distribution</h3>
            <div className="text-sm text-neutral-500">By Category</div>
          </div>
          <div className="space-y-4">
            {inventoryCategories.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${item.color}`}></div>
                  <span className="text-sm font-medium text-neutral-700">{item.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-neutral-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-neutral-900 w-8">{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">Top Suppliers</h3>
            <p className="text-sm text-neutral-500 mt-1">Performance ranking for this period</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topSuppliers.map((supplier, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{supplier.name}</div>
                      <div className="text-xs text-neutral-500">{supplier.orders} orders • {supplier.value}</div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceColor(supplier.performance)}`}>
                    {supplier.performance}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
            <p className="text-sm text-neutral-500 mt-1">Latest system activities and updates</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-neutral-900">Purchase Order PO-2025-001 approved</div>
                  <div className="text-xs text-neutral-500">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-neutral-900">Inventory updated for Office Supplies</div>
                  <div className="text-xs text-neutral-500">4 hours ago</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-neutral-900">Low stock alert for Safety Helmets</div>
                  <div className="text-xs text-neutral-500">6 hours ago</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-secondary-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-neutral-900">Shipment SHIP-002 delivered successfully</div>
                  <div className="text-xs text-neutral-500">8 hours ago</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-neutral-900">New supplier ABC Corporation added</div>
                  <div className="text-xs text-neutral-500">1 day ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}