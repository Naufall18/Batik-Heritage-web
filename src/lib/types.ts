export interface Category {
  id: number
  name: string
  slug: string
  icon: string | null
  children?: Category[]
}

export interface Region {
  id: number
  name: string
  latitude: number | null
  longitude: number | null
  vendors_count?: number
}

export interface Vendor {
  id: number
  name: string
  slug: string
  description: string | null
  whatsapp: string | null
  address: string | null
  city: string | null
  kecamatan: string | null
  kelurahan: string | null
  latitude: number | null
  longitude: number | null
  logo_path: string | null
  cover_path: string | null
  distance_km?: number
  products_count?: number
  products?: Product[]
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  technique: 'tulis' | 'cap' | 'printing' | 'kombinasi'
  motif: string | null
  material: string | null
  color: string | null
  is_featured: boolean
  images?: string[]
  primary_image?: string | null
  category?: { name: string; slug: string }
  vendor?: {
    name: string
    slug: string
    kecamatan: string | null
    latitude: number | null
    longitude: number | null
  }
}

export interface Paginated<T> {
  data: T[]
  meta: { current_page: number; last_page: number; total: number }
}

export interface DashboardStats {
  total_products: number
  total_orders: number
  total_revenue: number
  pending_orders: number
}

export interface VendorProfile {
  id: number
  name: string
  slug: string
  description: string | null
  whatsapp: string | null
  address: string | null
  city: string
  kecamatan: string | null
  kelurahan: string | null
  latitude: number | null
  longitude: number | null
  logo_path: string | null
  cover_path: string | null
  user: {
    name: string
    email: string
    phone: string | null
    address: string | null
  }
}

export interface AuthUser {
  id: number
  name: string
  email: string
  phone?: string | null
  address?: string | null
}

export interface AuthResponse {
  user: AuthUser
  access_token: string
  token_type: string
}

export interface CartItem {
  id: number
  product_id: number
  quantity: number
  product: Product
  created_at: string
}

export interface OrderItemData {
  id: number
  product_id: number
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: number
  order_number: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  total_amount: number
  shipping_address: string
  phone: string
  notes: string | null
  payment_type: string | null
  payment_method: string
  payment_status: string
  transaction_id: string | null
  snap_token: string | null
  paid_at: string | null
  items: OrderItemData[]
  user?: { id: number; name: string }
  created_at: string
  updated_at: string
}
