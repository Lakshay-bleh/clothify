'use client'

import { useEffect, useState } from 'react'
import { AdminRouteGuard } from '@/components/admin/admin-route-guard'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, formatDate } from '@/lib/utils'

export default function AdminOrdersPage() {
  return (
    <AdminRouteGuard>
      <AdminOrdersContent />
    </AdminRouteGuard>
  )
}

function AdminOrdersContent() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const ordersSnapshot = await getDocs(
        query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100))
      )
      setOrders(ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Orders</h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order {order.orderNumber}</CardTitle>
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
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date</span>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items</span>
                    <span>{order.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">{formatPrice(order.total || 0)}</span>
                  </div>
                  {order.shippingAddress && (
                    <div className="mt-4 border-t pt-4">
                      <p className="text-sm font-medium mb-2">Shipping Address</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.fullName}
                        <br />
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
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

