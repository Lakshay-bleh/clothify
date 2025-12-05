'use client'

import { useEffect, useState } from 'react'
import { AdminRouteGuard } from '@/components/admin/admin-route-guard'
import { ProductList } from '@/components/admin/product-list'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function AdminProductsPage() {
  return (
    <AdminRouteGuard>
      <AdminProductsContent />
    </AdminRouteGuard>
  )
}

function AdminProductsContent() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsSnapshot, categoriesSnapshot, brandsSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(50))),
        getDocs(query(collection(db, 'categories'), orderBy('name', 'asc'))),
        getDocs(query(collection(db, 'brands'), orderBy('name', 'asc'))),
      ])

      setProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setCategories(categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setBrands(brandsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductList
        products={products}
        categories={categories}
        brands={brands}
      />
    </div>
  )
}
