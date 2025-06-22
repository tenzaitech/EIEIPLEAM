import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Eye, Edit, MoreHorizontal } from 'lucide-react';

export default function PurchaseOrder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: 'PO-2025-001',
      supplier: 'ABC Corporation',
      contact: 'john.doe@abc-corp.com',
      amount: '$12,450.00',
      status: 'Pending',
      priority: 'High',
      orderDate: '2025-01-14',
      expectedDelivery: '2025-01-21',
      items: 15,
      category: 'Office Supplies'
    },
    {
      id: 'PO-2025-002',
      supplier: 'Tech Solutions Ltd',
      contact: 'sarah@techsolutions.com',
      amount: '$8,750.00',
      status: 'Approved',
      priority: 'Medium',
      orderDate: '2025-01-13',
      expectedDelivery: '2025-01-20',
      items: 8,
      category: 'IT Equipment'
    },
    {
      id: 'PO-2025-003',
      supplier: 'Global Manufacturing',
      contact: 'orders@globalmanuf.com',
      amount: '$25,300.00',
      status: 'Delivered',
      priority: 'High',
      orderDate: '2025-01-10',
      expectedDelivery: '2025-01-17',
      items: 32,
      category: 'Raw Materials'
    },
    {
      id: 'PO-2025-004',
      supplier: 'Office Depot Pro',
      contact: 'business@officedepot.com',
      amount: '$1,890.00',
      status: 'Cancelled',
      priority: 'Low',
      orderDate: '2025-01-12',
      expectedDelivery: '2025-01-19',
      items: 6,
      category: 'Office Supplies'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-secondary-600 bg-secondary-50';
      case 'Pending': return 'text-warning-600 bg-warning-50';
      case 'Delivered': return 'text-primary-600 bg-primary-50';
      case 'Cancelled': return 'text-error-600 bg-error-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-error-600 bg-error-50';
      case 'Medium': return 'text-warning-600 bg-warning-50';
      case 'Low': return 'text-secondary-600 bg-secondary-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Purchase Orders</h1>
          <p className="text-neutral-600 mt-2">Manage and track purchase orders with suppliers</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-white border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-50 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Order</span>
          </button>
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Order Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Supplier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Delivery</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{order.id}</div>
                      <div className="text-sm text-neutral-500">{order.category} • {order.items} items</div>
                      <div className="text-xs text-neutral-400">{order.orderDate}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{order.supplier}</div>
                      <div className="text-sm text-neutral-500">{order.contact}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-neutral-900">{order.amount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-neutral-900">{order.expectedDelivery}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No orders found</h3>
          <p className="text-neutral-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}