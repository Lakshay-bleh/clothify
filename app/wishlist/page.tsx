'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useWishlistStore } from '@/store/wishlist-store'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function WishlistPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { items, itemCount } = useWishlistStore()

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin?callbackUrl=/wishlist");
    }
  }, [user, router]);

  // Avoid rendering until we know user exists
  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="mt-2 text-muted-foreground">
            {itemCount()} {itemCount() === 1 ? 'item' : 'items'} saved
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
          <Heart className="mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold">Your wishlist is empty</h2>
          <p className="mb-6 text-muted-foreground">
            Start adding items you love to your wishlist
          </p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.id} product={item as any} />
          ))}
        </div>
      )}
    </div>
  )
}

