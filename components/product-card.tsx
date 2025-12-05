"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";

interface Variant {
  id: string;
  sku: string;
  size: string;
  color: string;
  stock: number;
  price?: number | null;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  salePrice?: number | null;
  images: { url: string; alt?: string | null }[];
  category?: { name: string } | null;
  brand?: { name: string } | null;
  isOnSale: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  variants?: Variant[] | null;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const openQuickView = useUIStore((state) => state.openQuickView);

  const inWishlist = isInWishlist(product.id);
  const primaryImage = product.images?.[0] ?? {
    url: "/placeholder.png",
    alt: "No image",
  };
  const secondaryImage = product.images?.[1] ?? primaryImage;
  const price = product.salePrice ?? product.basePrice;
  const hasDiscount = !!(product.isOnSale && product.salePrice);
  const discount = hasDiscount
    ? calculateDiscount(product.basePrice, product.salePrice!)
    : 0;

  // Safe variant selection
  const defaultVariant =
    product.variants?.find((v) => v.stock > 0) ?? product.variants?.[0] ?? null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultVariant) return;

    addToCart({
      id: `${product.id}-${defaultVariant.id}`,
      productId: product.id,
      variantId: defaultVariant.id,
      name: product.name,
      price: defaultVariant.price ?? price,
      image: primaryImage.url,
      size: defaultVariant.size,
      color: defaultVariant.color,
      sku: defaultVariant.sku,
      stock: defaultVariant.stock,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      salePrice: product.salePrice ?? undefined,
      image: primaryImage.url,
      slug: product.slug,
      isInStock: (defaultVariant?.stock ?? 0) > 0,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    openQuickView(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
          {/* Badges */}
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-black text-white">New</Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">{discount}% OFF</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 shadow-md transition-all hover:scale-110"
          >
            <Heart
              className={`h-5 w-5 transition-all ${
                inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>

          {/* Product Images */}
          <Image
            src={isHovered ? secondaryImage.url : primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            className="absolute bottom-0 left-0 right-0 flex gap-2 p-4"
          >
            <Button
              onClick={handleAddToCart}
              className="flex-1"
              size="sm"
              disabled={!defaultVariant || defaultVariant.stock === 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button onClick={handleQuickView} variant="secondary" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="mt-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">
                {product.brand?.name ?? product.category?.name ?? "Unknown"}
              </p>
              <h3 className="line-clamp-2 text-sm font-medium">
                {product.name}
              </h3>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-semibold">{formatPrice(price)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
