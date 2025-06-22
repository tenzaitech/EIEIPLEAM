import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function PurchaseRequest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const requests = [
    {
      id: 'PR-001',
      title: 'Office Supplies Purchase',
      requester: 'John Smith',
      department: 'Administration',
      totalAmount: '$1,250.00',
      status: 'Pending Approval',
      priority: 'Medium',
      dateRequested: '2025-01-14',
      description: 'Monthly office supplies including stationery, printer cartridges, and cleaning supplies'
    },
    {
      id: 'PR-002',
      title: 'IT Equipment Upgrade',
      requester: 'Sarah Johnson',
      department: 'IT',
      totalAmount: '$5,800.00',
      status: 'Approved',
      priority: 'High',
      dateRequested: '2025-01-13',
      description: 'New laptops and monitors for development team'
    },
    {
      id: 'PR-003',
      title: 'Laboratory Chemicals',
      requester: 'Dr. Michael Chen',
      department: 'R&D',
      totalAmount: '$3,200.00',
      status: 'Draft',
      priority: 'High',
      dateRequested: '2025-01-12',
      description: 'Research chemicals for ongoing experiments'
    },
    {
      id: 'PR-004',
      title: 'Maintenance Tools',
      requester: 'Robert Wilson',
      department: 'Maintenance',
      totalAmount: '$890.00',
      status: 'Rejected',
      priority: 'Low',
      dateRequested: '2025-01-11',
      description: 'Replacement tools for facility maintenance'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-secondary-600 bg-secondary-50 border-secondary-200';
      case 'Pending Approval': return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'Draft': return 'text-neutral-600 bg-neutral-50 border-neutral-200';
      case 'Rejected': return 'text-error-600 bg-error-50 border-error-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return CheckCircle;
      case 'Pending Approval': return Clock;
      case 'Draft': return Edit;
      case 'Rejected': return AlertTriangle;
      default: return Clock;
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

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase().includes(statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Purchase Requests</h1>
          <p className="text-neutral-600 mt-2">Manage and track purchase requests across departments</p>
        </div>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                <option value="pending">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="draft">Draft</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            {filteredRequests.length} of {requests.length} requests
          </div>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => {
          const StatusIcon = getStatusIcon(request.status);
          return (
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">{request.title}</h3>
                  <p className="text-sm text-neutral-500">{request.id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                    {request.priority}
                  </span>
                </div>
              </div>

              <p className="text-sm text-neutral-600 mb-4 line-clamp-2">{request.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Requester:</span>
                  <span className="text-neutral-900 font-medium">{request.requester}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Department:</span>
                  <span className="text-neutral-900">{request.department}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Amount:</span>
                  <span className="text-neutral-900 font-semibold">{request.totalAmount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Date:</span>
                  <span className="text-neutral-900">{request.dateRequested}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {request.status}
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-neutral-400 hover:text-secondary-600 hover:bg-secondary-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No requests found</h3>
          <p className="text-neutral-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}