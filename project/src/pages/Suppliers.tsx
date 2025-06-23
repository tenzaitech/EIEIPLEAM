import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Users, Star, Phone, Mail } from 'lucide-react';
import { useSupabaseQuery, useSupabaseMutation } from '../hooks/useSupabase';
import type { Supplier } from '../types';
import type { Database } from '../types/database';

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rankFilter, setRankFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const { data: suppliers, loading, refetch } = useSupabaseQuery('suppliers');
  const { insert, update, remove } = useSupabaseMutation('suppliers');

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRank = rankFilter === 'all' || supplier.supplier_rank === rankFilter;
    return matchesSearch && matchesRank;
  });

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'A': return 'text-primary-600 bg-primary-50';
      case 'B': return 'text-secondary-600 bg-secondary-50';
      case 'C': return 'text-warning-600 bg-warning-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getRankStars = (rank: string) => {
    const count = rank === 'A' ? 3 : rank === 'B' ? 2 : 1;
    return Array.from({ length: count }, (_, i) => (
      <Star key={i} className="w-3 h-3 fill-current" />
    ));
  };

  const handleSubmit = async (formData: Database['public']['Tables']['suppliers']['Insert']) => {
    try {
      if (editingSupplier) {
        await update(editingSupplier.id, formData);
      } else {
        await insert(formData);
      }
      setShowForm(false);
      setEditingSupplier(null);
      refetch();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this supplier?')) {
      try {
        await remove(id);
        refetch();
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Supplier Management</h1>
          <p className="text-neutral-600 mt-2">Manage your restaurant suppliers and vendor relationships</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">{suppliers.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">A-Rank Suppliers</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {suppliers.filter(s => s.supplier_rank === 'A').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-500 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {suppliers.filter(s => s.active).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">Countries</p>
              <p className="text-2xl font-bold text-neutral-900 mt-2">
                {new Set(suppliers.filter(s => s.country).map(s => s.country)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-neutral-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
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
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Ranks</option>
                <option value="A">A-Rank</option>
                <option value="B">B-Rank</option>
                <option value="C">C-Rank</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-neutral-500">
            {filteredSuppliers.length} of {suppliers.length} suppliers
          </div>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">{supplier.name}</h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankColor(supplier.supplier_rank)}`}>
                    <div className="flex items-center space-x-1 mr-1">
                      {getRankStars(supplier.supplier_rank)}
                    </div>
                    {supplier.supplier_rank}-Rank
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    supplier.active ? 'text-secondary-600 bg-secondary-50' : 'text-neutral-600 bg-neutral-50'
                  }`}>
                    {supplier.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingSupplier(supplier);
                    setShowForm(true);
                  }}
                  className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(supplier.id)}
                  className="p-2 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {supplier.email && (
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <Mail className="w-4 h-4" />
                  <span>{supplier.email}</span>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <Phone className="w-4 h-4" />
                  <span>{supplier.phone}</span>
                </div>
              )}
              {supplier.address && (
                <div className="text-sm text-neutral-600">
                  <p>{supplier.address}</p>
                  {(supplier.city || supplier.country) && (
                    <p>{[supplier.city, supplier.country].filter(Boolean).join(', ')}</p>
                  )}
                </div>
              )}
              {supplier.payment_terms && (
                <div className="text-sm">
                  <span className="text-neutral-500">Payment Terms: </span>
                  <span className="text-neutral-900 font-medium">{supplier.payment_terms}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Added: {new Date(supplier.created_at).toLocaleDateString()}</span>
                <span>Updated: {new Date(supplier.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No suppliers found</h3>
          <p className="text-neutral-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Supplier Form Modal */}
      {showForm && (
        <SupplierForm
          supplier={editingSupplier}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingSupplier(null);
          }}
        />
      )}
    </div>
  );
}

// Supplier Form Component
function SupplierForm({ 
  supplier, 
  onSubmit, 
  onClose 
}: { 
  supplier: Supplier | null; 
  onSubmit: (data: Database['public']['Tables']['suppliers']['Insert']) => void; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    city: supplier?.city || '',
    country: supplier?.country || '',
    zip_code: supplier?.zip_code || '',
    supplier_rank: supplier?.supplier_rank || 'B' as const,
    payment_terms: supplier?.payment_terms || '',
    active: supplier?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-xl font-semibold text-neutral-900">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Supplier Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Supplier Rank *
              </label>
              <select
                required
                value={formData.supplier_rank}
                onChange={(e) => setFormData({ ...formData, supplier_rank: e.target.value as 'A' | 'B' | 'C' })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="A">A-Rank (Premium)</option>
                <option value="B">B-Rank (Standard)</option>
                <option value="C">C-Rank (Basic)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Payment Terms
              </label>
              <input
                type="text"
                placeholder="e.g., Net 30, COD, etc."
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
            <label htmlFor="active" className="ml-2 block text-sm text-neutral-700">
              Active Supplier
            </label>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {supplier ? 'Update Supplier' : 'Create Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}