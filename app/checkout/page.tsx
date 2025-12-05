'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/utils'
import { addDocument } from '@/lib/firestore-utils'
import { motion } from 'framer-motion'
import { CreditCard, Smartphone, Wallet } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, total, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "UPI" | "COD">(
    "COD"
  );

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin?callbackUrl=/checkout");
    } else if (items.length === 0) {
      router.push("/shop");
    }
  }, [user, items]);

  // Redirect logic must run in the browser only
  useEffect(() => {
    if (!user) {
      router.push("/auth/signin?callbackUrl=/checkout");
    } else if (items.length === 0) {
      router.push("/shop");
    }
  }, [user, items]);

  // Instead of returning null immediately, wait for redirect
  if (!user || items.length === 0) {
    return null;
  }
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Create order in Firestore
      const orderData = {
        userId: user.uid,
        orderNumber: `ORD-${Date.now()}`,
        status: "PENDING",
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
        })),
        subtotal: subtotal(),
        shipping: subtotal() > 5000 ? 0 : 200,
        total: total(),
        shippingAddress: shippingInfo,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "PENDING" : "COMPLETED",
        createdAt: new Date(),
      };

      const orderId = await addDocument("orders", orderData);

      // Clear cart
      clearCart();

      // Redirect to success page
      router.push(`/orders/${orderId}?success=true`);
    } catch (error) {
      console.error("Order creation error:", error);
      alert("Failed to create order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const shipping = subtotal() > 5000 ? 0 : 200;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-center">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s}
                </div>
                {s < 2 && (
                  <div
                    className={`h-1 w-16 ${
                      step > s ? "bg-primary" : "bg-muted"
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
                            setShippingInfo({
                              ...shippingInfo,
                              fullName: e.target.value,
                            })
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
                            setShippingInfo({
                              ...shippingInfo,
                              email: e.target.value,
                            })
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
                          setShippingInfo({
                            ...shippingInfo,
                            phone: e.target.value,
                          })
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
                          setShippingInfo({
                            ...shippingInfo,
                            addressLine1: e.target.value,
                          })
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
                            setShippingInfo({
                              ...shippingInfo,
                              city: e.target.value,
                            })
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
                            setShippingInfo({
                              ...shippingInfo,
                              state: e.target.value,
                            })
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
                            setShippingInfo({
                              ...shippingInfo,
                              postalCode: e.target.value,
                            })
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
                  <CardTitle>Payment Method (Demo)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <button
                      onClick={() => setPaymentMethod("CARD")}
                      className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                        paymentMethod === "CARD"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <CreditCard className="h-6 w-6" />
                      <div className="flex-1 text-left">
                        <p className="font-semibold">Card Payment (Demo)</p>
                        <p className="text-sm text-muted-foreground">
                          Simulated payment - No real transaction
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("UPI")}
                      className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                        paymentMethod === "UPI"
                          ? "border-primary bg-primary/5"
                          : "border-border"
                      }`}
                    >
                      <Smartphone className="h-6 w-6" />
                      <div className="flex-1 text-left">
                        <p className="font-semibold">UPI (Demo)</p>
                        <p className="text-sm text-muted-foreground">
                          PhonePe, Google Pay, Paytm - Simulated
                        </p>
                      </div>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("COD")}
                      className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 transition-all ${
                        paymentMethod === "COD"
                          ? "border-primary bg-primary/5"
                          : "border-border"
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
                      {isProcessing ? "Processing..." : "Place Order"}
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
                      <p className="text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
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
    </div>
  );
}
