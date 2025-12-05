import { create } from 'zustand'

interface UIStore {
  // Mobile menu
  isMobileMenuOpen: boolean
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  
  // Filters sidebar
  isFilterOpen: boolean
  toggleFilter: () => void
  closeFilter: () => void
  
  // Quick view modal
  quickViewProduct: string | null
  openQuickView: (productId: string) => void
  closeQuickView: () => void
  
  // AI Assistant
  isAIAssistantOpen: boolean
  toggleAIAssistant: () => void
  closeAIAssistant: () => void
  
  // Search
  isSearchOpen: boolean
  toggleSearch: () => void
  closeSearch: () => void
  
  // Loading states
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  // Mobile menu
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  
  // Filters
  isFilterOpen: false,
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
  closeFilter: () => set({ isFilterOpen: false }),
  
  // Quick view
  quickViewProduct: null,
  openQuickView: (productId) => set({ quickViewProduct: productId }),
  closeQuickView: () => set({ quickViewProduct: null }),
  
  // AI Assistant
  isAIAssistantOpen: false,
  toggleAIAssistant: () => set((state) => ({ isAIAssistantOpen: !state.isAIAssistantOpen })),
  closeAIAssistant: () => set({ isAIAssistantOpen: false }),
  
  // Search
  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  closeSearch: () => set({ isSearchOpen: false }),
  
  // Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}))

