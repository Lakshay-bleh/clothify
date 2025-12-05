import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string
  productId: string
  name: string
  price: number
  salePrice?: number
  image: string
  slug: string
  isInStock: boolean
}

interface WishlistStore {
  items: WishlistItem[]
  
  // Actions
  addItem: (item: WishlistItem) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  toggleItem: (item: WishlistItem) => void
  
  // Computed
  itemCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items
        const exists = items.find((i) => i.productId === item.productId)
        
        if (!exists) {
          set({ items: [...items, item] })
        }
      },
      
      removeItem: (productId) => {
        set({
          items: get().items.filter((i) => i.productId !== productId),
        })
      },
      
      clearWishlist: () => {
        set({ items: [] })
      },
      
      isInWishlist: (productId) => {
        return get().items.some((i) => i.productId === productId)
      },
      
      toggleItem: (item) => {
        const isInWishlist = get().isInWishlist(item.productId)
        
        if (isInWishlist) {
          get().removeItem(item.productId)
        } else {
          get().addItem(item)
        }
      },
      
      itemCount: () => {
        return get().items.length
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)

