'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function MakeAdminPage() {
  const { user, profile } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      if (!user) {
        setError('You must be signed in to make users admin')
        setLoading(false)
        return
      }

      // Find user by email
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)

      if (querySnapshot.empty) {
        setError('User not found. Please make sure the user has signed up first.')
        setLoading(false)
        return
      }

      const userDoc = querySnapshot.docs[0]
      const userId = userDoc.id

      // Check if current user is admin or making themselves admin
      if (profile?.role !== 'ADMIN' && userId !== user.uid) {
        setError('Only admins can make other users admin. Or you can make yourself admin if you know the email.')
        setLoading(false)
        return
      }

      // Update user role to ADMIN
      await updateDoc(doc(db, 'users', userId), {
        role: 'ADMIN',
        updatedAt: new Date(),
      })

      setMessage(`✅ User ${email} is now an ADMIN! Sign out and sign back in to access admin features.`)
      setEmail('')
    } catch (error: any) {
      console.error('Error making user admin:', error)
      setError(error.message || 'Failed to make user admin. Check Firestore rules.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Make User Admin</CardTitle>
          <CardDescription>
            Enter the email of the user you want to make an admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMakeAdmin} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                {message}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">User Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                The user must have signed up first
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading || !user}>
              {loading ? 'Processing...' : 'Make Admin'}
            </Button>

            {!user && (
              <p className="text-center text-sm text-muted-foreground">
                Please <a href="/auth/signin" className="text-primary hover:underline">sign in</a> first
              </p>
            )}
          </form>

          <div className="mt-6 border-t pt-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> After making a user admin, they need to sign out and sign back in for the changes to take effect.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

