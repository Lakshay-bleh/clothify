'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/utils'
import { CheckCircle, Package } from 'lucide-react'
import Link from 'next/link'

export default function OrderPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const success = searchParams.get('success') === 'true'

  useEffect(() => {
    if (params.id && user) {
      fetchOrder(params.id as string)
    }
  }, [params.id, user])

  const fetchOrder = async (orderId: string) => {
    try {
      const orderDoc = await getDoc(doc(db, 'orders', orderId))
      if (orderDoc.exists()) {
        setOrder({ id: orderDoc.id, ...orderDoc.data() })
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading order...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Order not found</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {success && (
        <Card className="mb-8 border-green-500 bg-green-50">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <h2 className="text-xl font-bold text-green-900">Order Placed Successfully!</h2>
                <p className="text-green-700">Your order has been confirmed. We'll send you an email with order details.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
          <p className="mt-2 text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge
          variant={
            order.status === 'DELIVERED'
              ? 'default'
              : order.status === 'CANCELLED'
              ? 'destructive'
              : 'secondary'
          }
        >
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 border-b pb-4 last:border-0">
                    <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.total || item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {order.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && (
                    <>
                      <br />
                      {order.shippingAddress.addressLine2}
                    </>
                  )}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.postalCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    formatPrice(order.shipping || 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t pt-4 font-semibold">
                <span>Total</span>
                <span className="text-lg">{formatPrice(order.total || 0)}</span>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <p className="font-medium">{order.paymentMethod || 'N/A'}</p>
              </div>
              <Button className="w-full mt-4" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

