'use client'

import { useEffect, useState } from 'react'
import { AdminRouteGuard } from '@/components/admin/admin-route-guard'
import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function AdminPage() {
  return (
    <AdminRouteGuard>
      <AdminPageContent />
    </AdminRouteGuard>
  )
}

function AdminPageContent() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch all stats from Firestore
      const [ordersSnapshot, productsSnapshot, usersSnapshot] = await Promise.all([
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'products')),
        getDocs(query(collection(db, 'users'), where('role', '==', 'CUSTOMER'))),
      ])

      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const totalRevenue = orders
        .filter((o: any) => o.status === 'DELIVERED')
        .reduce((sum: number, o: any) => sum + (o.total || 0), 0)

      const recentOrders = orders
        .sort((a: any, b: any) => {
          const aTime = a.createdAt?.toMillis?.() || 0
          const bTime = b.createdAt?.toMillis?.() || 0
          return bTime - aTime
        })
        .slice(0, 10)

      const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const topProducts = products
        .sort((a: any, b: any) => (b.sales || 0) - (a.sales || 0))
        .slice(0, 10)

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalProducts: products.length,
        totalCustomers: usersSnapshot.size,
        recentOrders,
        topProducts,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Failed to load dashboard</p>
      </div>
    )
  }

  return <AdminDashboard stats={stats} />
}
