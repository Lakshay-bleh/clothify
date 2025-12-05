import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch product
    const productDoc = await adminDb.collection('products').doc(id).get()

    if (!productDoc.exists) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = {
      id: productDoc.id,
      ...productDoc.data(),
    }

    // Increment view count
    await adminDb.collection('products').doc(id).update({
      views: FieldValue.increment(1),
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
