import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { userId, items, shippingAddress, paymentMethod } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate items
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      // Get product variant from Firestore
      const variantDoc = await adminDb
        .collection('products')
        .doc(item.productId)
        .collection('variants')
        .doc(item.variantId)
        .get()
      
      if (!variantDoc.exists) {
        return NextResponse.json(
          { error: `Variant not found for ${item.name}` },
          { status: 400 }
        )
      }

      const variant = variantDoc.data()
      
      if (!variant || variant.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        )
      }

      const price = item.price
      const itemTotal = price * item.quantity

      subtotal += itemTotal

      orderItems.push({
        productId: item.productId,
        variantId: item.variantId,
        name: item.name,
        sku: item.sku,
        size: item.size,
        color: item.color,
        image: item.image,
        quantity: item.quantity,
        price,
        total: itemTotal,
      })

      // Update stock
      await adminDb
        .collection('products')
        .doc(item.productId)
        .collection('variants')
        .doc(item.variantId)
        .update({
          stock: FieldValue.increment(-item.quantity),
        })
    }

    // Calculate shipping
    const shippingCost = subtotal > 5000 ? 0 : 200

    // Calculate tax (18% GST)
    const tax = subtotal * 0.18

    // Total
    const total = subtotal + shippingCost + tax

    // Create order
    const orderData = {
      userId,
      orderNumber: generateOrderNumber(),
      status: 'PENDING',
      subtotal,
      tax,
      shippingCost,
      discount: 0,
      total,
      shippingAddress,
      billingAddress: shippingAddress,
      shippingMethod: 'STANDARD',
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
      items: orderItems,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    }

    const orderRef = await adminDb.collection('orders').add(orderData)

    return NextResponse.json({ 
      order: {
        id: orderRef.id,
        ...orderData,
      }
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
