'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, Edit, Trash2, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

interface ProductListProps {
  products: any[]
  categories: any[]
  brands: any[]
}

export function ProductList({ products, categories, brands }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory =
      selectedCategory === 'all' || product.categoryId === selectedCategory
    
    const matchesBrand =
      selectedBrand === 'all' || product.brandId === selectedBrand

    return matchesSearch && matchesCategory && matchesBrand
  })

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {filteredProducts.length} Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 font-medium">Product</th>
                  <th className="pb-3 font-medium">Category</th>
                  <th className="pb-3 font-medium">Brand</th>
                  <th className="pb-3 font-medium">Price</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0]?.url && (
                          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                            <img
                              src={product.images[0].url}
                              alt={product.name || 'Product'}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{product.name || 'Unnamed Product'}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.slug || '-'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">{product.category?.name || product.categoryId || 'Uncategorized'}</td>
                    <td className="py-4">{product.brand?.name || product.brandId || '-'}</td>
                    <td className="py-4">
                      <div>
                        <p className="font-medium">
                          {formatPrice(product.salePrice || product.basePrice)}
                        </p>
                        {product.isOnSale && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.basePrice)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4">
                      {product.variants && Array.isArray(product.variants)
                        ? product.variants.reduce(
                            (sum: number, v: any) => sum + (v.stock || 0),
                            0
                          )
                        : 0}
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          product.publishedAt ? 'default' : 'secondary'
                        }
                      >
                        {product.publishedAt ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/products/${product.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

