import React, { useState } from 'react';
import { Search, Filter, Grid, List, Package, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const inventoryItems = [
    {
      id: 'INV-001',
      name: 'Office Chairs - Ergonomic',
      category: 'Office Supplies',
      currentStock: 25,
      minStock: 10,
      maxStock: 50,
      unitPrice: 125.00,
      totalValue: 3125.00,
      location: 'Warehouse A-01',
      lastUpdated: '2025-01-14T10:30:00Z',
      status: 'In Stock',
      trend: 'stable',
      image: 'https://images.pexels.com/photos/586960/pexels-photo-586960.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 'INV-002',
      name: 'Laptop - Dell XPS 13',
      category: 'IT Equipment',
      currentStock: 3,
      minStock: 5,
      maxStock: 20,
      unitPrice: 1200.00,
      totalValue: 3600.00,
      location: 'IT Storage',
      lastUpdated: '2025-01-14T09:15:00Z',
      status: 'Low Stock',
      trend: 'down',
      image: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 'INV-003',
      name: 'Paper Reams - A4',
      category: 'Office Supplies',
      currentStock: 150,
      minStock: 50,
      maxStock: 200,
      unitPrice: 5.50,
      totalValue: 825.00,
      location: 'Storage Room B',
      lastUpdated: '2025-01-13T16:45:00Z',
      status: 'In Stock',
      trend: 'up',
      image: 'https://images.pexels.com/photos/6373305/pexels-photo-6373305.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 'INV-004',
      name: 'Safety Helmets',
      category: 'Safety Equipment',
      currentStock: 0,
      minStock: 20,
      maxStock: 100,
      unitPrice: 45.00,
      totalValue: 0.00,
      location: 'Safety Storage',
      lastUpdated: '2025-01-12T14:20:00Z',
      status: 'Out of Stock',
      trend: 'down',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 'INV-005',
      name: 'Chemical Reagent XYZ',
      category: 'Laboratory',
      currentStock: 85,
      minStock: 30,
      maxStock: 100,
      unitPrice: 75.00,
      totalValue: 6375.00,
      location: 'Lab Storage -5°C',
      lastUpdated: '2025-01-14T11:00:00Z',
      status: 'In Stock',
      trend: 'stable',
      image: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    },
    {
      id: 'INV-006',
      name: 'Packaging Boxes - Medium',
      category: 'Packaging',
      currentStock: 500,
      minStock: 100,
      maxStock: 1000,
      unitPrice: 2.25,
      totalValue: 1125.00,
      location: 'Warehouse C-03',
      lastUpdated: '2025-01-13T13:30:00Z',
      status: 'In Stock',
      trend: 'up',
      image: 'https://images.pexels.com/photos/4040669/pexels-photo-4040669.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
    }
  ];

  const categories = ['all', ...Array.from(new Set(inventoryItems.map(item => item.category)))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock': return 'text-secondary-600 bg-secondary-50';
      case 'Low Stock': return 'text-warning-600 bg-warning-50';
      case 'Out of Stock': return 'text-error-600 bg-error-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return null;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-secondary-500';
      case 'down': return 'text-error-500';
      default: return 'text-neutral-400';
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = filteredItems.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = filteredItems.filter(item => item.status === 'Low Stock' || item.status === 'Out of Stock').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Inventory Management</h1>
          <p className="text-neutral-600 mt-2">Track and manage your inventory levels and stock movements</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white border border-neutral-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Items</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">{filteredItems.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Value</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">${totalValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">{lowStockItems}</p>
            </div>
            <div className="w-12 h-12 bg-warning-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            {filteredItems.length} of {inventoryItems.length} items
          </div>
        </div>
      </div>

      {/* Inventory Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const TrendIcon = getTrendIcon(item.trend);
            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex items-center space-x-2">
                    {TrendIcon && <TrendIcon className={`w-4 h-4 ${getTrendColor(item.trend)}`} />}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-neutral-500">{item.id} • {item.category}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Current Stock:</span>
                    <span className="text-neutral-900 font-medium">{item.currentStock}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Min/Max:</span>
                    <span className="text-neutral-900">{item.minStock}/{item.maxStock}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Unit Price:</span>
                    <span className="text-neutral-900 font-medium">${item.unitPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-500">Total Value:</span>
                    <span className="text-neutral-900 font-semibold">${item.totalValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200">
                  <p className="text-xs text-neutral-400">Location: {item.location}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredItems.map((item) => {
                  const TrendIcon = getTrendIcon(item.trend);
                  return (
                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <div>
                            <div className="text-sm font-medium text-neutral-900">{item.name}</div>
                            <div className="text-sm text-neutral-500">{item.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500">{item.category}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-neutral-900">{item.currentStock}</span>
                          {TrendIcon && <TrendIcon className={`w-4 h-4 ${getTrendColor(item.trend)}`} />}
                        </div>
                        <div className="text-xs text-neutral-500">Min: {item.minStock} | Max: {item.maxStock}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-neutral-900">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-900">${item.totalValue.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-500">{item.location}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No items found</h3>
          <p className="text-neutral-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}