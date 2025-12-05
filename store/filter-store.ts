import { create } from 'zustand'

export interface FilterState {
  categories: string[]
  brands: string[]
  colors: string[]
  sizes: string[]
  priceRange: [number, number]
  gender: string[]
  sortBy: string
  search: string
  
  // Actions
  setCategories: (categories: string[]) => void
  setBrands: (brands: string[]) => void
  setColors: (colors: string[]) => void
  setSizes: (sizes: string[]) => void
  setPriceRange: (range: [number, number]) => void
  setGender: (gender: string[]) => void
  setSortBy: (sortBy: string) => void
  setSearch: (search: string) => void
  resetFilters: () => void
  
  // Computed
  activeFilterCount: () => number
}

const initialState = {
  categories: [],
  brands: [],
  colors: [],
  sizes: [],
  priceRange: [0, 50000] as [number, number],
  gender: [],
  sortBy: 'featured',
  search: '',
}

export const useFilterStore = create<FilterState>((set, get) => ({
  ...initialState,
  
  setCategories: (categories) => set({ categories }),
  setBrands: (brands) => set({ brands }),
  setColors: (colors) => set({ colors }),
  setSizes: (sizes) => set({ sizes }),
  setPriceRange: (range) => set({ priceRange: range }),
  setGender: (gender) => set({ gender }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearch: (search) => set({ search }),
  
  resetFilters: () => set(initialState),
  
  activeFilterCount: () => {
    const state = get()
    let count = 0
    
    if (state.categories.length > 0) count++
    if (state.brands.length > 0) count++
    if (state.colors.length > 0) count++
    if (state.sizes.length > 0) count++
    if (state.gender.length > 0) count++
    if (state.priceRange[0] !== 0 || state.priceRange[1] !== 50000) count++
    
    return count
  },
}))

