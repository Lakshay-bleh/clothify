'use client'

import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useFirestoreProducts } from '@/hooks/useFirestoreProducts'

interface ProductGridProps {
  searchParams: {
    category?: string
    brand?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    size?: string
    color?: string
    gender?: string
  }
}

export function ProductGrid({ searchParams }: ProductGridProps) {
  const { products, loading } = useFirestoreProducts({
    category: searchParams.category,
    brand: searchParams.brand,
    gender: searchParams.gender,
    minPrice: searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined,
    sortBy: searchParams.sort || 'createdAt',
    limitCount: 24,
    realtime: true,
  })

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <h3 className="mb-2 text-lg font-semibold">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your filters or search terms
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {products.length} products
        </p>
        
        <Select defaultValue={searchParams.sort || 'featured'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
