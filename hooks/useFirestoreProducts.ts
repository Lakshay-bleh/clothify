'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  basePrice: number
  salePrice: number | null
  images: any[]
  category: any
  brand: any
  isOnSale: boolean
  isFeatured: boolean
  isNew: boolean
  [key: string]: any
}

interface UseProductsOptions {
  category?: string
  brand?: string
  gender?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  limitCount?: number
  realtime?: boolean
}

export function useFirestoreProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const constraints: QueryConstraint[] = []

    // Apply filters
    if (options.category) {
      constraints.push(where('categoryId', '==', options.category))
    }

    if (options.brand) {
      constraints.push(where('brandId', '==', options.brand))
    }

    if (options.gender) {
      constraints.push(where('gender', '==', options.gender))
    }

    if (options.minPrice !== undefined) {
      constraints.push(where('basePrice', '>=', options.minPrice))
    }

    if (options.maxPrice !== undefined) {
      constraints.push(where('basePrice', '<=', options.maxPrice))
    }

    // Apply sorting
    const sortField = options.sortBy === 'price' ? 'basePrice' : 'createdAt'
    constraints.push(orderBy(sortField, 'desc'))

    // Apply limit
    if (options.limitCount) {
      constraints.push(limit(options.limitCount))
    }

    const q = query(collection(db, 'products'), ...constraints)

    // Use realtime listener if enabled
    if (options.realtime) {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const productsList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Product[]
          setProducts(productsList)
          setLoading(false)
        },
        (err) => {
          setError(err.message)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } else {
      // One-time fetch
      import('firebase/firestore').then(({ getDocs }) => {
        getDocs(q)
          .then((snapshot) => {
            const productsList = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Product[]
            setProducts(productsList)
            setLoading(false)
          })
          .catch((err) => {
            setError(err.message)
            setLoading(false)
          })
      })
    }
  }, [
    options.category,
    options.brand,
    options.gender,
    options.minPrice,
    options.maxPrice,
    options.sortBy,
    options.limitCount,
    options.realtime,
  ])

  return { products, loading, error }
}

export function useFirestoreProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const q = query(
      collection(db, 'products'),
      where('slug', '==', slug),
      limit(1)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0]
          setProduct({ id: doc.id, ...doc.data() } as Product)
        } else {
          setProduct(null)
        }
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [slug])

  return { product, loading, error }
}

