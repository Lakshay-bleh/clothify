"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Truck,
  RefreshCw,
  Share2,
  Star,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product-card";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { formatPrice, calculateDiscount } from "@/lib/utils";

interface ProductDetailProps {
  product: any;
  relatedProducts: any[];
}

export function ProductDetail({
  product,
  relatedProducts,
}: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const addToCart = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const price = product.salePrice || product.basePrice;
  const hasDiscount = product.isOnSale && product.salePrice;
  const discount = hasDiscount
    ? calculateDiscount(product.basePrice, product.salePrice)
    : 0;

  // Safe access to variants - handle both array and undefined
  const variants = product.variants || [];

  // Get available colors and sizes
  const colors: string[] =
    variants.length > 0
      ? [
          ...new Set(
            variants.map((v: any) => v.color).filter(Boolean) as string[]
          ),
        ]
      : [];
  const sizes: string[] =
    variants.length > 0
      ? [
          ...new Set(
            variants.map((v: any) => v.size).filter(Boolean) as string[]
          ),
        ]
      : [];

  // Find selected variant
  const selectedVariant =
    variants.length > 0
      ? variants.find(
          (v: any) =>
            (!selectedColor || v.color === selectedColor) &&
            (!selectedSize || v.size === selectedSize)
        ) || variants[0]
      : null;

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const productImage = product.images?.[0]?.url || "/placeholder.png";

    addToCart({
      id: `${product.id}-${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: selectedVariant.price || price,
      image: productImage,
      size: selectedVariant.size,
      color: selectedVariant.color,
      sku: selectedVariant.sku,
      stock: selectedVariant.stock,
    });
  };

  const handleWishlist = () => {
    const productImage = product.images?.[0]?.url || "/placeholder.png";

    toggleItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.basePrice,
      salePrice: product.salePrice,
      image: productImage,
      slug: product.slug,
      isInStock: selectedVariant?.stock > 0 || false,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          {/* Main Image */}
          {product.images && product.images.length > 0 ? (
            <>
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={
                    product.images[selectedImage]?.url ||
                    product.images[0]?.url ||
                    "/placeholder.png"
                  }
                  alt={product.name || "Product image"}
                  fill
                  className="object-cover"
                  priority
                />
                {hasDiscount && (
                  <Badge
                    variant="destructive"
                    className="absolute left-4 top-4"
                  >
                    {discount}% OFF
                  </Badge>
                )}
              </motion.div>

              {/* Thumbnail Grid */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-6 gap-2">
                  {product.images.map((image: any, index: number) => (
                    <button
                      key={image.id || index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={image.url || "/placeholder.png"}
                        alt={`Product image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Brand & Category */}
          {(product.category || product.brand) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {product.category && (
                <Link
                  href={`/shop?category=${
                    product.category.slug || product.categoryId || ""
                  }`}
                  className="hover:text-foreground"
                >
                  {product.category.name || "Category"}
                </Link>
              )}
              {product.brand && (
                <>
                  {product.category && <span>/</span>}
                  <Link
                    href={`/shop?brand=${
                      product.brand.slug || product.brandId || ""
                    }`}
                    className="hover:text-foreground"
                  >
                    {product.brand.name || "Brand"}
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">{formatPrice(price)}</span>
            {hasDiscount && (
              <>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.basePrice)}
                </span>
                <Badge variant="destructive">{discount}% OFF</Badge>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground">{product.description}</p>

          {/* Color Selection */}
          {colors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">
                Color: {selectedColor || "Select"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <Button
                    key={String(color)}
                    variant={selectedColor === color ? "default" : "outline"}
                    onClick={() => setSelectedColor(String(color))}
                    className="min-w-[80px]"
                  >
                    {String(color)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {sizes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  Size: {selectedSize || "Select"}
                </h3>
                <Button variant="link" size="sm" className="h-auto p-0">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Size Guide
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <Button
                    key={String(size)}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => setSelectedSize(String(size))}
                    className="min-w-[60px]"
                  >
                    {String(size)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Status */}
          {selectedVariant && (
            <div className="flex items-center gap-2">
              {selectedVariant.stock > 0 ? (
                <>
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-600">
                    {selectedVariant.stock < 10
                      ? `Only ${selectedVariant.stock} left!`
                      : "In Stock"}
                  </span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-sm text-red-600">Out of Stock</span>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.stock === 0}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlist}>
              <Heart
                className={`h-5 w-5 ${
                  inWishlist ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button size="lg" variant="outline">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="space-y-3 border-t pt-6">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">
                  On orders above ₹5,000
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">
                  30-day return policy
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">AI Size Recommendation</p>
                <p className="text-xs text-muted-foreground">
                  Get personalized size suggestions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="mt-6">
            <Card className="p-6">
              <div className="prose max-w-none">
                <h3>Product Details</h3>
                <p>{product.longDescription || product.description}</p>
                {product.materials &&
                  Array.isArray(product.materials) &&
                  product.materials.length > 0 && (
                    <>
                      <h4>Materials</h4>
                      <ul>
                        {product.materials.map(
                          (material: string, index: number) => (
                            <li key={material || index}>{material}</li>
                          )
                        )}
                      </ul>
                    </>
                  )}
                {product.careInstructions && (
                  <>
                    <h4>Care Instructions</h4>
                    <p>{product.careInstructions}</p>
                  </>
                )}
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="reviews" className="mt-6">
            <Card className="p-6">
              <p className="text-muted-foreground">Reviews coming soon...</p>
            </Card>
          </TabsContent>
          <TabsContent value="shipping" className="mt-6">
            <Card className="p-6">
              <div className="prose max-w-none">
                <h3>Shipping Information</h3>
                <p>Free shipping on orders above ₹5,000</p>
                <p>Standard delivery: 5-7 business days</p>
                <p>
                  Express delivery: 2-3 business days (additional charges apply)
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">You May Also Like</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
