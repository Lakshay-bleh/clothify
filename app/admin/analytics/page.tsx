'use client'

import { AdminRouteGuard } from '@/components/admin/admin-route-guard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export default function AdminAnalyticsPage() {
  return (
    <AdminRouteGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Analytics</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analytics features coming soon. This page will show detailed sales analytics, customer insights, and performance metrics.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminRouteGuard>
  )
}

