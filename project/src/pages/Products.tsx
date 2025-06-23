import React, { useState } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { useSupabaseQuery, useSupabaseMutation } from '../hooks/useSupabase';
import { useLanguage } from '../contexts/LanguageContext';
import type { Product } from '../types';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { t } = useLanguage();

  const { data: products, loading, refetch } = useSupabaseQuery('products', {
    orderBy: { column: 'name', ascending: true }
  });

  const { insert, update, remove } = useSupabaseMutation('products');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || product.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getStockStatus = (product: any) => {
    if (product.current_stock <= product.minimum_stock) {
      return { status: t('status.low-stock'), color: 'text-error-600 bg-error-50' };
    } else if (product.current_stock >= product.maximum_stock) {
      return { status: 'สต๊อกเกิน', color: 'text-warning-600 bg-warning-50' };
    }
    return { status: t('status.in-stock'), color: 'text-secondary-600 bg-secondary-50' };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'raw_material': return 'text-primary-600 bg-primary-50';
      case 'finished_product': return 'text-secondary-600 bg-secondary-50';
      case 'service': return 'text-warning-600 bg-warning-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'raw_material': return 'วัตถุดิบ';
      case 'finished_product': return 'สินค้าสำเร็จรูป';
      case 'service': return 'บริการ';
      default: return type;
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (editingProduct) {
        await update(editingProduct.id, formData);
      } else {
        await insert(formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      refetch();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?')) {
      try {
        await remove(id);
        refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
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
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{t('products.title')}</h1>
            <p className="text-neutral-600 text-lg">{t('products.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-primary-500/25"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">{t('products.add-product')}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">{t('products.total-products')}</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">{products.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">{t('products.raw-materials')}</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {products.filter(p => p.type === 'raw_material').length}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">{t('products.finished-products')}</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {products.filter(p => p.type === 'finished_product').length}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-warning-500 to-warning-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-600">{t('products.low-stock')}</p>
              <p className="text-3xl font-bold text-neutral-900 mt-2">
                {products.filter(p => p.current_stock <= p.minimum_stock).length}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-error-500 to-error-600 rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder={t('common.search') + ' ' + t('products.title').toLowerCase() + '...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80 text-sm"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-12 pr-10 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white text-sm min-w-[200px]"
              >
                <option value="all">ทุกประเภท</option>
                <option value="raw_material">วัตถุดิบ</option>
                <option value="finished_product">สินค้าสำเร็จรูป</option>
                <option value="service">บริการ</option>
              </select>
            </div>
          </div>
          <div className="text-sm text-neutral-500 bg-neutral-50 px-4 py-2 rounded-lg">
            แสดง {filteredProducts.length} จาก {products.length} รายการ
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">{t('products.product-name')}</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">{t('products.type')}</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">{t('products.stock')}</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">{t('products.pricing')}</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">{t('common.status')}</th>
                <th className="px-8 py-4 text-left text-sm font-semibold text-neutral-700">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-8 py-5">
                      <div>
                        <div className="text-sm font-semibold text-neutral-900">{product.name}</div>
                        <div className="text-sm text-neutral-500">{product.code}</div>
                        {product.description && (
                          <div className="text-xs text-neutral-400 mt-1">{product.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getTypeColor(product.type)}`}>
                        {getTypeText(product.type)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm">
                        <div className="font-semibold text-neutral-900">
                          {product.current_stock} {product.unit_of_measure}
                        </div>
                        <div className="text-neutral-500 text-xs">
                          ขั้นต่ำ: {product.minimum_stock} | สูงสุด: {product.maximum_stock}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-sm">
                        <div className="font-semibold text-neutral-900">
                          ทุน: ฿{product.cost_price.toFixed(2)}
                        </div>
                        <div className="text-neutral-500">
                          ขาย: ฿{product.list_price.toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowForm(true);
                          }}
                          className="p-2.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2.5 text-neutral-400 hover:text-error-600 hover:bg-error-50 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-12 text-center">
          <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">{t('common.no-data')}</h3>
          <p className="text-neutral-500">ลองปรับเปลี่ยนคำค้นหาหรือตัวกรอง</p>
        </div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

// Product Form Component
function ProductForm({ 
  product, 
  onSubmit, 
  onClose 
}: { 
  product: Product | null; 
  onSubmit: (data: any) => void; 
  onClose: () => void; 
}) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    code: product?.code || '',
    description: product?.description || '',
    type: product?.type || 'raw_material',
    unit_of_measure: product?.unit_of_measure || 'kg',
    list_price: product?.list_price || 0,
    cost_price: product?.cost_price || 0,
    minimum_stock: product?.minimum_stock || 0,
    maximum_stock: product?.maximum_stock || 0,
    current_stock: product?.current_stock || 0,
    active: product?.active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 border-b border-neutral-200">
          <h2 className="text-2xl font-semibold text-neutral-900">
            {product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('products.product-name')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="ระบุชื่อสินค้า"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('products.product-code')} *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="เช่น PRD001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-3">
              {t('common.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="รายละเอียดสินค้า (ไม่บังคับ)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('products.type')} *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="raw_material">วัตถุดิบ</option>
                <option value="finished_product">สินค้าสำเร็จรูป</option>
                <option value="service">บริการ</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('products.unit-measure')} *
              </label>
              <select
                required
                value={formData.unit_of_measure}
                onChange={(e) => setFormData({ ...formData, unit_of_measure: e.target.value })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="kg">กิโลกรัม (kg)</option>
                <option value="g">กรัม (g)</option>
                <option value="l">ลิตร (l)</option>
                <option value="ml">มิลลิลิตร (ml)</option>
                <option value="pcs">ชิ้น (pcs)</option>
                <option value="box">กล่อง</option>
                <option value="pack">แพ็ค</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('products.cost-price')} (฿) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.cost_price}
                onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('products.list-price')} (฿) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.list_price}
                onChange={(e) => setFormData({ ...formData, list_price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('products.current-stock')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.current_stock}
                onChange={(e) => setFormData({ ...formData, current_stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('products.minimum-stock')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.minimum_stock}
                onChange={(e) => setFormData({ ...formData, minimum_stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                {t('products.maximum-stock')}
              </label>
              <input
                type="number"
                min="0"
                value={formData.maximum_stock}
                onChange={(e) => setFormData({ ...formData, maximum_stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
            />
            <label htmlFor="active" className="ml-3 block text-sm font-medium text-neutral-700">
              {t('common.active')}
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors font-medium"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-medium shadow-lg shadow-primary-500/25"
            >
              {product ? 'อัปเดตสินค้า' : 'สร้างสินค้า'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}