'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'
import { useFilterStore } from '@/store/filter-store'
import { formatPrice } from '@/lib/utils'

export function FilterSidebar() {
  const {
    categories,
    brands,
    colors,
    sizes,
    priceRange,
    gender,
    setCategories,
    setBrands,
    setColors,
    setSizes,
    setPriceRange,
    setGender,
    resetFilters,
    activeFilterCount,
  } = useFilterStore()

  const [localPriceRange, setLocalPriceRange] = useState<number[]>(priceRange)

  const availableCategories = [
    { id: 'tshirts', label: 'T-Shirts' },
    { id: 'shirts', label: 'Shirts' },
    { id: 'jeans', label: 'Jeans' },
    { id: 'dresses', label: 'Dresses' },
    { id: 'jackets', label: 'Jackets' },
    { id: 'accessories', label: 'Accessories' },
  ]

  const availableBrands = [
    { id: 'zara', label: 'Zara' },
    { id: 'hm', label: 'H&M' },
    { id: 'nike', label: 'Nike' },
    { id: 'adidas', label: 'Adidas' },
  ]

  const availableColors = [
    { id: 'black', label: 'Black', hex: '#000000' },
    { id: 'white', label: 'White', hex: '#FFFFFF' },
    { id: 'red', label: 'Red', hex: '#EF4444' },
    { id: 'blue', label: 'Blue', hex: '#3B82F6' },
    { id: 'green', label: 'Green', hex: '#10B981' },
  ]

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  const availableGenders = [
    { id: 'MEN', label: 'Men' },
    { id: 'WOMEN', label: 'Women' },
    { id: 'UNISEX', label: 'Unisex' },
  ]

  const toggleArrayFilter = (
    value: string,
    currentValues: string[],
    setter: (values: string[]) => void
  ) => {
    if (currentValues.includes(value)) {
      setter(currentValues.filter((v) => v !== value))
    } else {
      setter([...currentValues, value])
    }
  }

  return (
    <div className="space-y-4">
      {/* Active Filters */}
      {activeFilterCount() > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                Active Filters ({activeFilterCount()})
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="h-8 px-2 text-xs"
              >
                Clear All
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Gender */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Gender</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableGenders.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${item.id}`}
                checked={gender.includes(item.id)}
                onCheckedChange={() =>
                  toggleArrayFilter(item.id, gender, setGender)
                }
              />
              <Label
                htmlFor={`gender-${item.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={categories.includes(category.id)}
                onCheckedChange={() =>
                  toggleArrayFilter(category.id, categories, setCategories)
                }
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            min={0}
            max={50000}
            step={500}
            value={localPriceRange}
            onValueChange={setLocalPriceRange}
            onValueCommit={setPriceRange}
          />
          <div className="flex items-center justify-between text-sm">
            <span>{formatPrice(localPriceRange[0])}</span>
            <span>{formatPrice(localPriceRange[1])}</span>
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => (
              <button
                key={color.id}
                onClick={() => toggleArrayFilter(color.id, colors, setColors)}
                className={`h-8 w-8 rounded-full border-2 transition-all ${
                  colors.includes(color.id)
                    ? 'border-primary scale-110'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <Button
                key={size}
                variant={sizes.includes(size) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleArrayFilter(size, sizes, setSizes)}
              >
                {size}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brands */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Brands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {availableBrands.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand.id}`}
                checked={brands.includes(brand.id)}
                onCheckedChange={() =>
                  toggleArrayFilter(brand.id, brands, setBrands)
                }
              />
              <Label
                htmlFor={`brand-${brand.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {brand.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

