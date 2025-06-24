import axios from 'axios';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://eieipleam-api.vercel.app';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service Class
export class ApiService {
  // Authentication
  static async login(email: string, password: string) {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response.data;
  }

  static async logout() {
    const response = await apiClient.post('/api/auth/logout');
    return response.data;
  }

  static async getProfile() {
    const response = await apiClient.get('/api/auth/profile');
    return response.data;
  }

  // Products
  static async getProducts(params?: any) {
    const response = await apiClient.get('/api/products', { params });
    return response.data;
  }

  static async createProduct(product: any) {
    const response = await apiClient.post('/api/products', product);
    return response.data;
  }

  static async updateProduct(id: string, product: any) {
    const response = await apiClient.put(`/api/products/${id}`, product);
    return response.data;
  }

  static async deleteProduct(id: string) {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data;
  }

  // Suppliers
  static async getSuppliers(params?: any) {
    const response = await apiClient.get('/api/suppliers', { params });
    return response.data;
  }

  static async createSupplier(supplier: any) {
    const response = await apiClient.post('/api/suppliers', supplier);
    return response.data;
  }

  static async updateSupplier(id: string, supplier: any) {
    const response = await apiClient.put(`/api/suppliers/${id}`, supplier);
    return response.data;
  }

  static async deleteSupplier(id: string) {
    const response = await apiClient.delete(`/api/suppliers/${id}`);
    return response.data;
  }

  // Purchase Orders
  static async getPurchaseOrders(params?: any) {
    const response = await apiClient.get('/api/orders', { params });
    return response.data;
  }

  static async createPurchaseOrder(order: any) {
    const response = await apiClient.post('/api/orders', order);
    return response.data;
  }

  static async updatePurchaseOrder(id: string, order: any) {
    const response = await apiClient.put(`/api/orders/${id}`, order);
    return response.data;
  }

  static async deletePurchaseOrder(id: string) {
    const response = await apiClient.delete(`/api/orders/${id}`);
    return response.data;
  }

  // Inventory
  static async getInventory(params?: any) {
    const response = await apiClient.get('/api/inventory', { params });
    return response.data;
  }

  static async updateInventory(id: string, inventory: any) {
    const response = await apiClient.put(`/api/inventory/${id}`, inventory);
    return response.data;
  }

  // Analytics
  static async getAnalytics(params?: any) {
    const response = await apiClient.get('/api/analytics', { params });
    return response.data;
  }

  // Odoo Integration
  static async getOdooProducts() {
    const response = await apiClient.get('/api/odoo/products');
    return response.data;
  }

  static async getOdooSuppliers() {
    const response = await apiClient.get('/api/odoo/suppliers');
    return response.data;
  }

  static async getOdooOrders() {
    const response = await apiClient.get('/api/odoo/orders');
    return response.data;
  }

  static async testOdooConnection() {
    const response = await apiClient.get('/api/odoo/test');
    return response.data;
  }

  static async syncWithOdoo(type: string, data?: any) {
    const response = await apiClient.post('/api/odoo/sync', { type, data });
    return response.data;
  }

  // Sync Operations
  static async testConnections() {
    const response = await apiClient.get('/api/sync/test');
    return response.data;
  }

  static async syncProducts() {
    const response = await apiClient.post('/api/sync/products');
    return response.data;
  }

  static async syncSuppliers() {
    const response = await apiClient.post('/api/sync/suppliers');
    return response.data;
  }

  static async syncPurchaseOrders() {
    const response = await apiClient.post('/api/sync/purchase-orders');
    return response.data;
  }

  static async fullSync() {
    const response = await apiClient.post('/api/sync/full');
    return response.data;
  }

  static async getSyncStatus() {
    const response = await apiClient.get('/api/sync/status');
    return response.data;
  }

  // Health Check
  static async healthCheck() {
    const response = await apiClient.get('/health');
    return response.data;
  }
}

// Export default instance
export default ApiService; 