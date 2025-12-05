'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  LogOut,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart-store'
import { useWishlistStore } from '@/store/wishlist-store'
import { useUIStore } from '@/store/ui-store'
import { motion } from 'framer-motion'

export function Header() {
  const { user, profile, signOut, isAdmin } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  
  const cartItemCount = useCartStore((state) => state.itemCount())
  const wishlistItemCount = useWishlistStore((state) => state.itemCount())
  const toggleCart = useCartStore((state) => state.toggleCart)
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu)

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto">
        {/* Top Bar */}
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-2xl font-bold"
            >
              CLOTHIFY
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link
              href="/shop"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Shop
            </Link>
            <Link
              href="/shop?gender=MEN"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Men
            </Link>
            <Link
              href="/shop?gender=WOMEN"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Women
            </Link>
            <Link
              href="/shop?isNew=true"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              New Arrivals
            </Link>
            <Link
              href="/shop?isOnSale=true"
              className="text-sm font-medium text-red-600 transition-colors hover:text-red-500"
            >
              Sale
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search (Mobile) */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {wishlistItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                  >
                    {wishlistItemCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User */}
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="icon" title="Admin Dashboard">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link href="/account">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <div className="hidden border-t py-3 lg:block">
          <div className="flex items-center justify-center gap-8 px-4">
            <Link
              href="/shop?category=tshirts"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              T-Shirts
            </Link>
            <Link
              href="/shop?category=shirts"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Shirts
            </Link>
            <Link
              href="/shop?category=jeans"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Jeans
            </Link>
            <Link
              href="/shop?category=dresses"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Dresses
            </Link>
            <Link
              href="/shop?category=jackets"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Jackets
            </Link>
            <Link
              href="/shop?category=accessories"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Accessories
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
