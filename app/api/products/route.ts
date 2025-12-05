import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const gender = searchParams.get('gender')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort') || 'createdAt'
    const limitCount = parseInt(searchParams.get('limit') || '24')

    // Build query
    let query: any = adminDb.collection('products')

    if (category) {
      query = query.where('categoryId', '==', category)
    }

    if (brand) {
      query = query.where('brandId', '==', brand)
    }

    if (gender) {
      query = query.where('gender', '==', gender.toUpperCase())
    }

    if (minPrice) {
      query = query.where('basePrice', '>=', parseFloat(minPrice))
    }

    if (maxPrice) {
      query = query.where('basePrice', '<=', parseFloat(maxPrice))
    }

    // Apply sorting
    const sortField = sort === 'price' ? 'basePrice' : sort === 'price-desc' ? 'basePrice' : 'createdAt'
    const sortDirection = sort === 'price' ? 'asc' : 'desc'
    query = query.orderBy(sortField, sortDirection).limit(limitCount)

    // Fetch products
    const snapshot = await query.get()
    const products = snapshot.docs.map(
      (doc: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => ({
        id: doc.id,
        ...doc.data(),
      })
    )
    

    const response = {
      products,
      pagination: {
        page: 1,
        limit: limitCount,
        total: products.length,
        totalPages: Math.ceil(products.length / limitCount),
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
