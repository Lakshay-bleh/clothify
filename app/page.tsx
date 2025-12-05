"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { useFirestoreProducts } from "@/hooks/useFirestoreProducts";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  const { products: featuredProducts, loading } = useFirestoreProducts({
    limitCount: 8,
    realtime: true,
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="container mx-auto h-full px-4">
          <div className="flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="mb-6 text-5xl font-bold md:text-7xl">
              Discover Your Style
              <br />
              <span className="text-yellow-300">with Clothify</span>
            </h1>
            <p className="mb-8 max-w-2xl text-lg md:text-xl">
              Shop the latest trends in fashion. Quality clothing for every
              occasion.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100"
                asChild
              >
                <Link href="/shop">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/shop?isOnSale=true">View Sale</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Free delivery on orders above ₹5,000
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <RefreshCw className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">
                30-day hassle-free returns policy
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                100% secure payment processing
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { name: "Women", href: "/shop?gender=WOMEN" },
              { name: "Men", href: "/shop?gender=MEN" },
              { name: "New Arrivals", href: "/shop?isNew=true" },
              { name: "Sale", href: "/shop?isOnSale=true" },
            ].map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
              >
                <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="outline" asChild>
              <Link href="/shop">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>
                No products available yet. Add products from the admin
                dashboard!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
