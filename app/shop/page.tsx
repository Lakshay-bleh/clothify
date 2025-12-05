'use client'

import { ProductGrid } from '@/components/product-grid'
import { FilterSidebar } from '@/components/filter-sidebar'
import { ProductGridSkeleton } from '@/components/product-grid-skeleton'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ShopContent() {
  const searchParams = useSearchParams()
  
  const params = {
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    sort: searchParams.get('sort') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    size: searchParams.get('size') || undefined,
    color: searchParams.get('color') || undefined,
    gender: searchParams.get('gender') || undefined,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Shop All</h1>
        <p className="mt-2 text-muted-foreground">
          Discover our complete collection
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Filters */}
        <aside className="w-full lg:w-64 lg:flex-shrink-0">
          <FilterSidebar />
        </aside>

        {/* Products */}
        <div className="flex-1">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ShopContent />
    </Suspense>
  )
}
