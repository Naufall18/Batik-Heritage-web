import { create } from 'zustand'
import type { CartItem } from '../lib/types'
import * as api from '../lib/api'

interface CartState {
  items: CartItem[]
  loading: boolean
  count: number
  fetch: () => Promise<void>
  addItem: (productId: number, quantity?: number) => Promise<void>
  updateItem: (cartId: number, quantity: number) => Promise<void>
  removeItem: (cartId: number) => Promise<void>
  clear: () => void
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,
  count: 0,

  fetch: async () => {
    try {
      set({ loading: true })
      const items = await api.getCart()
      set({ items, count: items.reduce((s, i) => s + i.quantity, 0), loading: false })
    } catch {
      set({ loading: false })
    }
  },

  addItem: async (productId, quantity = 1) => {
    await api.addToCart(productId, quantity)
    await get().fetch()
  },

  updateItem: async (cartId, quantity) => {
    await api.updateCartItem(cartId, quantity)
    await get().fetch()
  },

  removeItem: async (cartId) => {
    await api.removeCartItem(cartId)
    await get().fetch()
  },

  clear: () => set({ items: [], count: 0 }),
}))
