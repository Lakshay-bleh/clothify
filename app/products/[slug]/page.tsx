"use client";

import { useEffect, useState } from "react";
import { useFirestoreProduct } from "@/hooks/useFirestoreProducts";
import { ProductDetail } from "@/components/product-detail";
import { useFirestoreProducts } from "@/hooks/useFirestoreProducts";

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { product, loading } = useFirestoreProduct(params.slug);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (product?.categoryId) {
      // Fetch related products
      // This would need to be implemented in the hook
    }
  }, [product]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
