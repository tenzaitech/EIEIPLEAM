export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          code: string;
          description: string | null;
          list_price: number;
          cost_price: number;
          type: 'raw_material' | 'finished_product' | 'service';
          category_id: string | null;
          unit_of_measure: string;
          minimum_stock: number;
          maximum_stock: number;
          current_stock: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          zip_code: string | null;
          supplier_rank: 'A' | 'B' | 'C';
          payment_terms: string | null;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['suppliers']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['suppliers']['Insert']>;
      };
      purchase_requests: {
        Row: {
          id: string;
          pr_number: string;
          requester_id: string;
          department: string;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          expected_date: string;
          notes: string | null;
          status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
          total_amount: number;
          created_at: string;
          approved_at: string | null;
          approved_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['purchase_requests']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['purchase_requests']['Insert']>;
      };
      purchase_orders: {
        Row: {
          id: string;
          po_number: string;
          request_id: string | null;
          supplier_id: string;
          order_date: string;
          expected_date: string;
          status: 'draft' | 'sent' | 'confirmed' | 'partially_received' | 'received' | 'cancelled';
          total_amount: number;
          notes: string | null;
          created_at: string;
          created_by: string;
        };
        Insert: Omit<Database['public']['Tables']['purchase_orders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['purchase_orders']['Insert']>;
      };
      goods_receipts: {
        Row: {
          id: string;
          gr_number: string;
          po_id: string;
          received_by: string;
          verified_by: string | null;
          notes: string | null;
          status: 'draft' | 'received' | 'verified' | 'discrepancy';
          received_at: string;
          verified_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['goods_receipts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['goods_receipts']['Insert']>;
      };
      storage_locations: {
        Row: {
          id: string;
          name: string;
          code: string;
          temperature: number | null;
          humidity: number | null;
          capacity: number;
          location_type: 'warehouse' | 'cold_storage' | 'dry_storage' | 'freezer';
          notes: string | null;
          current_usage: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['storage_locations']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['storage_locations']['Insert']>;
      };
      processing_records: {
        Row: {
          id: string;
          batch_number: string;
          product_id: string;
          input_quantity: number;
          output_quantity: number | null;
          process_type: 'preparation' | 'cooking' | 'packaging' | 'quality_control';
          processed_by: string;
          notes: string | null;
          status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['processing_records']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['processing_records']['Insert']>;
      };
      transportation_orders: {
        Row: {
          id: string;
          transport_number: string;
          from_location: string;
          to_location: string;
          driver_id: string | null;
          vehicle_id: string | null;
          expected_departure: string;
          expected_arrival: string;
          actual_departure: string | null;
          actual_arrival: string | null;
          status: 'scheduled' | 'in_transit' | 'delivered' | 'cancelled';
          notes: string | null;
          created_at: string;
          created_by: string;
        };
        Insert: Omit<Database['public']['Tables']['transportation_orders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['transportation_orders']['Insert']>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}