import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Database, 
  Server, 
  Cloud,
  AlertTriangle,
  Settings,
  ArrowRight,
  Activity,
  Package,
  ShoppingCart
} from 'lucide-react';
import { ApiService } from '../services/api.service';
import { useLanguage } from '../contexts/LanguageContext';

interface ConnectionStatus {
  supabase: boolean;
  odoo: boolean;
  details: {
    supabase?: string;
    odoo?: string;
  };
}

interface SyncStatus {
  connections: ConnectionStatus;
  statistics: {
    products: number;
    suppliers: number;
    purchase_orders: number;
  };
  last_sync: string;
}

export default function SystemStatus() {
  const { t } = useLanguage();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load initial data
  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const [connectionResult, syncResult] = await Promise.all([
        ApiService.testConnections(),
        ApiService.getSyncStatus()
      ]);
      
      setConnectionStatus(connectionResult.data);
      setSyncStatus(syncResult.data);
    } catch (error) {
      console.error('Failed to load status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (type: 'products' | 'suppliers' | 'purchase-orders' | 'full') => {
    try {
      setSyncing(true);
      let result;
      
      switch (type) {
        case 'products':
          result = await ApiService.syncProducts();
          break;
        case 'suppliers':
          result = await ApiService.syncSuppliers();
          break;
        case 'purchase-orders':
          result = await ApiService.syncPurchaseOrders();
          break;
        case 'full':
          result = await ApiService.fullSync();
          break;
      }
      
      // Reload status after sync
      await loadStatus();
      setLastRefresh(new Date());
      
      // Show success message
      alert(`Sync completed: ${result.message}`);
    } catch (error) {
      console.error('Sync failed:', error);
      alert(`Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSyncing(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">กำลังโหลดสถานะระบบ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">สถานะระบบ</h1>
            <p className="text-neutral-600 text-lg">ตรวจสอบการเชื่อมต่อและจัดการการซิงค์ข้อมูล</p>
          </div>
          <button
            onClick={loadStatus}
            disabled={loading}
            className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>รีเฟรช</span>
          </button>
        </div>
        <div className="mt-4 text-sm text-neutral-500">
          อัปเดตล่าสุด: {lastRefresh.toLocaleString('th-TH')}
        </div>
      </div>

      {/* Connection Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supabase Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-primary-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Supabase</h3>
            </div>
            {connectionStatus && getStatusIcon(connectionStatus.supabase)}
          </div>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${connectionStatus ? getStatusColor(connectionStatus.supabase) : 'text-neutral-600 bg-neutral-50'}`}>
            {connectionStatus?.supabase ? 'เชื่อมต่อสำเร็จ' : 'เชื่อมต่อล้มเหลว'}
          </div>
          {connectionStatus?.details.supabase && (
            <p className="mt-2 text-sm text-neutral-600">{connectionStatus.details.supabase}</p>
          )}
        </div>

        {/* Odoo Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Server className="w-6 h-6 text-secondary-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Odoo</h3>
            </div>
            {connectionStatus && getStatusIcon(connectionStatus.odoo)}
          </div>
          <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${connectionStatus ? getStatusColor(connectionStatus.odoo) : 'text-neutral-600 bg-neutral-50'}`}>
            {connectionStatus?.odoo ? 'เชื่อมต่อสำเร็จ' : 'เชื่อมต่อล้มเหลว'}
          </div>
          {connectionStatus?.details.odoo && (
            <p className="mt-2 text-sm text-neutral-600">{connectionStatus.details.odoo}</p>
          )}
        </div>

        {/* Vercel Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Cloud className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-neutral-900">Vercel</h3>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-green-600 bg-green-50">
            ใช้งานได้
          </div>
          <p className="mt-2 text-sm text-neutral-600">API และ Frontend ทำงานปกติ</p>
        </div>
      </div>

      {/* Sync Operations */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-neutral-600" />
            <h3 className="text-xl font-semibold text-neutral-900">การซิงค์ข้อมูล</h3>
          </div>
          <div className="text-sm text-neutral-500">
            ข้อมูลล่าสุด: {syncStatus?.last_sync ? new Date(syncStatus.last_sync).toLocaleString('th-TH') : 'ไม่ทราบ'}
          </div>
        </div>

        {/* Sync Statistics */}
        {syncStatus && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">สินค้า</p>
                  <p className="text-2xl font-bold text-neutral-900">{syncStatus.statistics.products}</p>
                </div>
                <Package className="w-8 h-8 text-primary-500" />
              </div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">ผู้จำหน่าย</p>
                  <p className="text-2xl font-bold text-neutral-900">{syncStatus.statistics.suppliers}</p>
                </div>
                <Activity className="w-8 h-8 text-secondary-500" />
              </div>
            </div>
            <div className="bg-neutral-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">คำสั่งซื้อ</p>
                  <p className="text-2xl font-bold text-neutral-900">{syncStatus.statistics.purchase_orders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-warning-500" />
              </div>
            </div>
          </div>
        )}

        {/* Sync Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleSync('products')}
            disabled={syncing || !connectionStatus?.supabase || !connectionStatus?.odoo}
            className="flex items-center justify-between p-4 bg-primary-50 border border-primary-200 rounded-xl hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-primary-900">ซิงค์สินค้า</span>
            </div>
            <ArrowRight className="w-4 h-4 text-primary-600" />
          </button>

          <button
            onClick={() => handleSync('suppliers')}
            disabled={syncing || !connectionStatus?.supabase || !connectionStatus?.odoo}
            className="flex items-center justify-between p-4 bg-secondary-50 border border-secondary-200 rounded-xl hover:bg-secondary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-secondary-600" />
              <span className="font-medium text-secondary-900">ซิงค์ผู้จำหน่าย</span>
            </div>
            <ArrowRight className="w-4 h-4 text-secondary-600" />
          </button>

          <button
            onClick={() => handleSync('purchase-orders')}
            disabled={syncing || !connectionStatus?.supabase || !connectionStatus?.odoo}
            className="flex items-center justify-between p-4 bg-warning-50 border border-warning-200 rounded-xl hover:bg-warning-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5 text-warning-600" />
              <span className="font-medium text-warning-900">ซิงค์คำสั่งซื้อ</span>
            </div>
            <ArrowRight className="w-4 h-4 text-warning-600" />
          </button>

          <button
            onClick={() => handleSync('full')}
            disabled={syncing || !connectionStatus?.supabase || !connectionStatus?.odoo}
            className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-xl hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-3">
              <RefreshCw className={`w-5 h-5 text-neutral-600 ${syncing ? 'animate-spin' : ''}`} />
              <span className="font-medium text-neutral-900">ซิงค์ทั้งหมด</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        {/* Warning */}
        {(!connectionStatus?.supabase || !connectionStatus?.odoo) && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">ไม่สามารถซิงค์ข้อมูลได้</p>
                <p className="text-sm text-yellow-700">
                  กรุณาตรวจสอบการเชื่อมต่อ Supabase และ Odoo ก่อนดำเนินการซิงค์
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Environment Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        <h3 className="text-xl font-semibold text-neutral-900 mb-6">ข้อมูลสภาพแวดล้อม</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-neutral-700 mb-3">Frontend (Vercel)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">URL:</span>
                <span className="font-mono">https://eieipleam.vercel.app</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Environment:</span>
                <span className="font-mono">Production</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-neutral-700 mb-3">Backend API (Vercel)</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">URL:</span>
                <span className="font-mono">https://eieipleam-api.vercel.app</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Environment:</span>
                <span className="font-mono">Production</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 