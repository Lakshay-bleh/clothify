"use client";

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  variantId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  sku: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  
  // Computed
  itemCount: () => number
  subtotal: () => number
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.variantId === item.variantId)
        
        if (existingItem) {
          // Increase quantity if item exists
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: Math.min(i.quantity + 1, i.stock) }
                : i
            ),
          })
        } else {
          // Add new item
          set({
            items: [...items, { ...item, quantity: 1 }],
          })
        }
        
        // Open cart sidebar
        set({ isOpen: true })
      },
      
      removeItem: (variantId) => {
        set({
          items: get().items.filter((i) => i.variantId !== variantId),
        })
      },
      
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }
        
        set({
          items: get().items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.min(quantity, i.stock) }
              : i
          ),
        })
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      toggleCart: () => {
        set({ isOpen: !get().isOpen })
      },
      
      itemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      
      subtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      
      total: () => {
        const subtotal = get().subtotal()
        const shipping = subtotal > 0 ? (subtotal > 5000 ? 0 : 200) : 0
        return subtotal + shipping
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

