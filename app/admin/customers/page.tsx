'use client'

import { useEffect, useState } from 'react'
import { AdminRouteGuard } from '@/components/admin/admin-route-guard'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export default function AdminCustomersPage() {
  return (
    <AdminRouteGuard>
      <AdminCustomersContent />
    </AdminRouteGuard>
  )
}

function AdminCustomersContent() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const customersSnapshot = await getDocs(
        query(
          collection(db, 'users'),
          where('role', '==', 'CUSTOMER'),
          orderBy('createdAt', 'desc')
        )
      )
      setCustomers(customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading customers...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Customers</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No customers found</p>
            </CardContent>
          </Card>
        ) : (
          customers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader>
                <CardTitle>{customer.name || customer.email}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <Badge variant="secondary">{customer.role || 'CUSTOMER'}</Badge>
                </div>
                {customer.createdAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-sm">{formatDate(customer.createdAt)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

