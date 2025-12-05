'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface AdminRouteGuardProps {
  children: React.ReactNode
}

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user || profile?.role !== 'ADMIN') {
        router.push('/')
        return
      }
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user || profile?.role !== 'ADMIN') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You must be an admin to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

