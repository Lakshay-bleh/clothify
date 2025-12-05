'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

export function CartSidebar() {
  const {
    items,
    isOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    subtotal,
    total,
  } = useCartStore()

  const shipping = subtotal() > 5000 ? 0 : 200
  const hasItems = items.length > 0

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-6">
            {!hasItems ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-24 w-24 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Add some products to get started
                </p>
                <Button onClick={toggleCart} asChild>
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.variantId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-4 border-b pb-4"
                    >
                      {/* Product Image */}
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-medium line-clamp-2">
                              {item.name}
                            </h4>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {item.color} / {item.size}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Quantity & Price */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() =>
                                updateQuantity(item.variantId, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>

          {/* Cart Summary */}
          {hasItems && (
            <SheetFooter className="border-t pt-4">
              <div className="w-full space-y-4">
                {/* Subtotal */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {subtotal() < 5000 && subtotal() > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatPrice(5000 - subtotal())} more for free shipping
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between border-t pt-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">{formatPrice(total())}</span>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={toggleCart}
                    asChild
                  >
                    <Link href="/cart">View Cart</Link>
                  </Button>
                </div>
              </div>
            </SheetFooter>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

