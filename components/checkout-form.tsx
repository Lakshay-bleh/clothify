'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup } from '@/components/ui/radio-group'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal, total, clearCart } = useCartStore()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)

  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  })

  const [paymentMethod, setPaymentMethod] = useState<'STRIPE' | 'UPI' | 'COD'>('STRIPE')

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      if (paymentMethod === 'STRIPE') {
        // Create payment intent
        const response = await fetch('/api/checkout/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: total(),
            currency: 'inr',
          }),
        })

        const { clientSecret } = await response.json()

        const stripe = await stripePromise
        if (!stripe) throw new Error('Stripe not loaded')

        // Redirect to Stripe checkout
        const { error } = await stripe.confirmPayment({
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/checkout/success`,
          },
        })

        if (error) {
          throw error
        }
      } else if (paymentMethod === 'COD') {
        // Create order with COD
        const response = await fetch('/api/orders/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
            })),
            shippingAddress: shippingInfo,
            billingAddress: shippingInfo,
            paymentMethod: 'COD',
          }),
        })

        const { order } = await response.json()
        
        clearCart()
        router.push(`/orders/${order.orderNumber}`)
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const shipping = subtotal() > 5000 ? 0 : 200

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Main Form */}
      <div className="lg:col-span-2">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step >= s
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-1 w-16 ${
                    step > s ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Shipping Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        required
                        value={shippingInfo.fullName}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine1">Address Line 1 *</Label>
                    <Input
                      id="addressLine1"
                      required
                      value={shippingInfo.addressLine1}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, addressLine1: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressLine2">Address Line 2</Label>
                    <Input
                      id="addressLine2"
                      value={shippingInfo.addressLine2}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, addressLine2: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        required
                        value={shippingInfo.city}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, city: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        required
                        value={shippingInfo.state}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, state: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        required
                        value={shippingInfo.postalCode}
                        onChange={(e) =>
                          setShippingInfo({ ...shippingInfo, postalCode: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Payment Method */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentMethod('STRIPE')}
                    className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                      paymentMethod === 'STRIPE'
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <CreditCard className="h-6 w-6" />
                    <div className="flex-1 text-left">
                      <p className="font-semibold">Card / UPI / Wallets</p>
                      <p className="text-sm text-muted-foreground">
                        Pay securely with Stripe
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('UPI')}
                    className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <Smartphone className="h-6 w-6" />
                    <div className="flex-1 text-left">
                      <p className="font-semibold">UPI</p>
                      <p className="text-sm text-muted-foreground">
                        PhonePe, Google Pay, Paytm
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-primary bg-primary/5'
                        : 'border-border'
                    }`}
                  >
                    <Wallet className="h-6 w-6" />
                    <div className="flex-1 text-left">
                      <p className="font-semibold">Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Pay when you receive
                      </p>
                    </div>
                  </button>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-3">
                  <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-muted-foreground">
                      {item.size} / {item.color}
                    </p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t pt-4">
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
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total</span>
                <span className="text-lg">{formatPrice(total())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

