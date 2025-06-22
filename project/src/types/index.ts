export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'purchasing' | 'warehouse' | 'processing' | 'transport';
  department: string;
  avatar?: string;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  description?: string;
  list_price: number;
  cost_price: number;
  type: 'raw_material' | 'finished_product' | 'service';
  category_id?: string;
  unit_of_measure: string;
  minimum_stock: number;
  maximum_stock: number;
  current_stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  zip_code?: string;
  supplier_rank: 'A' | 'B' | 'C';
  payment_terms?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PurchaseRequest {
  id: string;
  pr_number: string;
  requester_id: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expected_date: string;
  notes?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  total_amount: number;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
  items?: PurchaseRequestItem[];
}

export interface PurchaseRequestItem {
  id: string;
  request_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  notes?: string;
  product?: Product;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  request_id?: string;
  supplier_id: string;
  order_date: string;
  expected_date: string;
  status: 'draft' | 'sent' | 'confirmed' | 'partially_received' | 'received' | 'cancelled';
  total_amount: number;
  notes?: string;
  created_at: string;
  created_by: string;
  supplier?: Supplier;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  received_quantity: number;
  notes?: string;
  product?: Product;
}

export interface GoodsReceipt {
  id: string;
  gr_number: string;
  po_id: string;
  received_by: string;
  verified_by?: string;
  notes?: string;
  status: 'draft' | 'received' | 'verified' | 'discrepancy';
  received_at: string;
  verified_at?: string;
  created_at: string;
  purchase_order?: PurchaseOrder;
  items?: GoodsReceiptItem[];
}

export interface GoodsReceiptItem {
  id: string;
  receipt_id: string;
  product_id: string;
  ordered_quantity: number;
  received_quantity: number;
  unit_price: number;
  notes?: string;
  product?: Product;
}

export interface StorageLocation {
  id: string;
  name: string;
  code: string;
  temperature?: number;
  humidity?: number;
  capacity: number;
  location_type: 'warehouse' | 'cold_storage' | 'dry_storage' | 'freezer';
  notes?: string;
  current_usage: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProcessingRecord {
  id: string;
  batch_number: string;
  product_id: string;
  input_quantity: number;
  output_quantity?: number;
  process_type: 'preparation' | 'cooking' | 'packaging' | 'quality_control';
  processed_by: string;
  notes?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  started_at?: string;
  completed_at?: string;
  created_at: string;
  product?: Product;
}

export interface TransportationOrder {
  id: string;
  transport_number: string;
  from_location: string;
  to_location: string;
  driver_id?: string;
  vehicle_id?: string;
  expected_departure: string;
  expected_arrival: string;
  actual_departure?: string;
  actual_arrival?: string;
  status: 'scheduled' | 'in_transit' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
  created_by: string;
  items?: TransportationItem[];
}

export interface TransportationItem {
  id: string;
  transport_id: string;
  product_id: string;
  quantity: number;
  notes?: string;
  product?: Product;
}

export interface DashboardStats {
  totalProducts: number;
  totalSuppliers: number;
  pendingPurchaseRequests: number;
  activePurchaseOrders: number;
  pendingGoodsReceipts: number;
  lowStockItems: number;
  activeProcessing: number;
  scheduledTransports: number;
  totalRevenue: number;
  monthlyGrowth: number;
}