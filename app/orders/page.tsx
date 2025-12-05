'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPrice, formatDate } from '@/lib/utils'
import { Package } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin?callbackUrl=/orders')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    if (!user) return
    
    try {
      const ordersSnapshot = await getDocs(
        query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        )
      )
      setOrders(ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
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
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold">No orders yet</h2>
            <p className="mb-6 text-muted-foreground">
              Start shopping to see your orders here
            </p>
            <Button asChild>
              <Link href="/shop">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
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
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total || 0)}</p>
                    <Button variant="outline" size="sm" asChild className="mt-2">
                      <Link href={`/orders/${order.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

