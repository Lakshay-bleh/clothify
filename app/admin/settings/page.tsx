'use client'

import { AdminRouteGuard } from '@/components/admin/admin-route-guard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <AdminRouteGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Admin Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings page coming soon. This page will allow you to configure store settings, manage admin users, and customize your store.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminRouteGuard>
  )
}

