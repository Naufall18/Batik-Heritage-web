import axios from 'axios'
import type {
  AuthResponse,
  CartItem,
  Category,
  DashboardStats,
  Order,
  Paginated,
  Product,
  Region,
  Vendor,
  VendorProfile,
} from './types'
import { useAuthStore } from '../store/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(err)
  },
)

export default api

export interface ProductFilters {
  q?: string
  category?: string
  technique?: string
  kecamatan?: string
  featured?: boolean
  sort?: string
  page?: number
}

export const getCategories = async (): Promise<Category[]> =>
  (await api.get('/categories')).data.data

export const getRegions = async (): Promise<Region[]> =>
  (await api.get('/regions')).data.data

export const getProducts = async (filters: ProductFilters = {}): Promise<Paginated<Product>> =>
  (await api.get('/products', { params: filters })).data

export const getProduct = async (slug: string): Promise<Product> =>
  (await api.get(`/products/${slug}`)).data.data

export const getVendors = async (kecamatan?: string): Promise<Vendor[]> =>
  (await api.get('/vendors', { params: kecamatan ? { kecamatan } : {} })).data.data

export const getVendor = async (slug: string): Promise<Vendor> =>
  (await api.get(`/vendors/${slug}`)).data.data

export const getNearbyVendors = async (
  lat: number,
  lng: number,
  radius = 25,
): Promise<Vendor[]> =>
  (await api.get('/vendors/nearby', { params: { lat, lng, radius, limit: 50 } })).data.data

export const login = async (email: string, password: string): Promise<AuthResponse> =>
  (await api.post('/auth/login', { email, password })).data

export const register = async (name: string, email: string, password: string, passwordConfirmation: string): Promise<AuthResponse> =>
  (await api.post('/auth/register', { name, email, password, password_confirmation: passwordConfirmation })).data

export const getMe = async () =>
  (await api.get('/auth/me')).data

export const logout = async () =>
  (await api.post('/auth/logout')).data

export const getCart = async (): Promise<CartItem[]> =>
  (await api.get('/cart')).data.data

export const addToCart = async (productId: number, quantity = 1): Promise<CartItem> =>
  (await api.post('/cart', { product_id: productId, quantity })).data.data

export const updateCartItem = async (cartId: number, quantity: number): Promise<CartItem> =>
  (await api.put(`/cart/${cartId}`, { quantity })).data.data

export const removeCartItem = async (cartId: number): Promise<void> =>
  api.delete(`/cart/${cartId}`)

export interface CheckoutPayload {
  shipping_address: string
  phone: string
  notes?: string
  payment_method?: 'cod' | 'midtrans'
}

export const checkout = async (payload: CheckoutPayload): Promise<Order> =>
  (await api.post('/checkout', payload)).data.data

export const getOrders = async (page = 1): Promise<Paginated<Order>> =>
  (await api.get('/orders', { params: { page } })).data

export const getOrder = async (id: number): Promise<Order> =>
  (await api.get(`/orders/${id}`)).data.data

export const getDashboardStats = async (): Promise<DashboardStats> =>
  (await api.get('/vendor/dashboard')).data.data

export const getVendorProducts = async (page = 1): Promise<Paginated<Product>> =>
  (await api.get('/vendor/products', { params: { page } })).data

export const createVendorProduct = async (form: FormData): Promise<Product> =>
  (await api.post('/vendor/products', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data

export const updateVendorProduct = async (id: number, form: FormData): Promise<Product> =>
  (await api.put(`/vendor/products/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data

export const deleteVendorProduct = async (id: number): Promise<void> =>
  api.delete(`/vendor/products/${id}`)

export const getVendorOrders = async (page = 1): Promise<Paginated<Order>> =>
  (await api.get('/vendor/orders', { params: { page } })).data

export const updateVendorOrderStatus = async (id: number, status: string): Promise<Order> =>
  (await api.put(`/vendor/orders/${id}/status`, { status })).data.data

export const getVendorProfile = async (): Promise<VendorProfile> =>
  (await api.get('/vendor/profile')).data.data

export const updateVendorProfile = async (form: FormData): Promise<VendorProfile> =>
  (await api.put('/vendor/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data.data
