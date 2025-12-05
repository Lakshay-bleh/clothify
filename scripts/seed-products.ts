// Script to seed mock products into Firestore
// Run with: npx tsx scripts/seed-products.ts

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import "dotenv/config";

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
  }),
})

const db = getFirestore(app)

const mockProducts = [
  {
    name: "Classic White T-Shirt",
    slug: "classic-white-tshirt",
    description: "Comfortable cotton t-shirt perfect for everyday wear",
    longDescription: "Made from 100% premium cotton, this classic white t-shirt offers comfort and style. Perfect for casual occasions.",
    basePrice: 999,
    salePrice: null,
    isOnSale: false,
    isFeatured: true,
    isNew: true,
    gender: "UNISEX",
    categoryId: "tshirts",
    brandId: "clothify",
    images: [
      { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", alt: "White T-Shirt", order: 0, isPrimary: true },
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500", alt: "White T-Shirt Back", order: 1, isPrimary: false }
    ],
    variants: [
      { size: "S", color: "White", colorHex: "#FFFFFF", stock: 50, sku: "TSH-WHT-S", price: null },
      { size: "M", color: "White", colorHex: "#FFFFFF", stock: 75, sku: "TSH-WHT-M", price: null },
      { size: "L", color: "White", colorHex: "#FFFFFF", stock: 60, sku: "TSH-WHT-L", price: null },
      { size: "XL", color: "White", colorHex: "#FFFFFF", stock: 40, sku: "TSH-WHT-XL", price: null }
    ],
    rating: 4.5,
    reviewCount: 24,
    views: 0,
    sales: 0,
    tags: ["casual", "cotton", "basic"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Slim Fit Denim Jeans",
    slug: "slim-fit-denim-jeans",
    description: "Classic blue denim jeans with modern slim fit",
    longDescription: "These premium denim jeans feature a slim fit design that's both comfortable and stylish. Perfect for casual and smart-casual occasions.",
    basePrice: 2999,
    salePrice: 2499,
    isOnSale: true,
    isFeatured: true,
    isNew: false,
    gender: "MEN",
    categoryId: "jeans",
    brandId: "clothify",
    images: [
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500", alt: "Blue Jeans", order: 0, isPrimary: true },
      { url: "https://images.unsplash.com/photo-1582418702059-97ebaf8e0bd2?w=500", alt: "Jeans Detail", order: 1, isPrimary: false }
    ],
    variants: [
      { size: "30", color: "Blue", colorHex: "#1E3A5F", stock: 30, sku: "JNS-BLU-30", price: null },
      { size: "32", color: "Blue", colorHex: "#1E3A5F", stock: 45, sku: "JNS-BLU-32", price: null },
      { size: "34", color: "Blue", colorHex: "#1E3A5F", stock: 40, sku: "JNS-BLU-34", price: null },
      { size: "36", color: "Blue", colorHex: "#1E3A5F", stock: 25, sku: "JNS-BLU-36", price: null }
    ],
    rating: 4.7,
    reviewCount: 18,
    views: 0,
    sales: 0,
    tags: ["denim", "slim-fit", "casual"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Floral Summer Dress",
    slug: "floral-summer-dress",
    description: "Beautiful floral print dress perfect for summer",
    longDescription: "This elegant floral dress features a vibrant print and lightweight fabric. Perfect for summer days, garden parties, or casual outings.",
    basePrice: 3999,
    salePrice: 2999,
    isOnSale: true,
    isFeatured: true,
    isNew: true,
    gender: "WOMEN",
    categoryId: "dresses",
    brandId: "clothify",
    images: [
      { url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500", alt: "Floral Dress", order: 0, isPrimary: true },
      { url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500", alt: "Dress Detail", order: 1, isPrimary: false }
    ],
    variants: [
      { size: "XS", color: "Floral Pink", colorHex: "#FFB6C1", stock: 20, sku: "DRS-FLR-XS", price: null },
      { size: "S", color: "Floral Pink", colorHex: "#FFB6C1", stock: 35, sku: "DRS-FLR-S", price: null },
      { size: "M", color: "Floral Pink", colorHex: "#FFB6C1", stock: 40, sku: "DRS-FLR-M", price: null },
      { size: "L", color: "Floral Pink", colorHex: "#FFB6C1", stock: 30, sku: "DRS-FLR-L", price: null }
    ],
    rating: 4.8,
    reviewCount: 32,
    views: 0,
    sales: 0,
    tags: ["dress", "floral", "summer"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Leather Jacket",
    slug: "leather-jacket",
    description: "Premium genuine leather jacket",
    longDescription: "Crafted from genuine leather, this classic moto-style jacket is built to last. Features YKK zippers and comfortable viscose lining.",
    basePrice: 8999,
    salePrice: null,
    isOnSale: false,
    isFeatured: true,
    isNew: false,
    gender: "UNISEX",
    categoryId: "jackets",
    brandId: "clothify",
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500", alt: "Leather Jacket", order: 0, isPrimary: true },
      { url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500", alt: "Jacket Detail", order: 1, isPrimary: false }
    ],
    variants: [
      { size: "S", color: "Black", colorHex: "#000000", stock: 15, sku: "JKT-BLK-S", price: null },
      { size: "M", color: "Black", colorHex: "#000000", stock: 25, sku: "JKT-BLK-M", price: null },
      { size: "L", color: "Black", colorHex: "#000000", stock: 20, sku: "JKT-BLK-L", price: null },
      { size: "XL", color: "Black", colorHex: "#000000", stock: 12, sku: "JKT-BLK-XL", price: null }
    ],
    rating: 4.6,
    reviewCount: 15,
    views: 0,
    sales: 0,
    tags: ["leather", "jacket", "premium"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Casual Button-Down Shirt",
    slug: "casual-button-down-shirt",
    description: "Versatile button-down shirt in premium cotton",
    longDescription: "This casual button-down shirt is perfect for work or casual occasions. Made from premium cotton with a modern fit.",
    basePrice: 1999,
    salePrice: 1499,
    isOnSale: true,
    isFeatured: false,
    isNew: true,
    gender: "MEN",
    categoryId: "shirts",
    brandId: "clothify",
    images: [
      { url: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=500", alt: "Button Shirt", order: 0, isPrimary: true },
      { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500", alt: "Shirt Detail", order: 1, isPrimary: false }
    ],
    variants: [
      { size: "S", color: "Light Blue", colorHex: "#ADD8E6", stock: 40, sku: "SHT-BLU-S", price: null },
      { size: "M", color: "Light Blue", colorHex: "#ADD8E6", stock: 55, sku: "SHT-BLU-M", price: null },
      { size: "L", color: "Light Blue", colorHex: "#ADD8E6", stock: 45, sku: "SHT-BLU-L", price: null },
      { size: "XL", color: "Light Blue", colorHex: "#ADD8E6", stock: 30, sku: "SHT-BLU-XL", price: null }
    ],
    rating: 4.4,
    reviewCount: 12,
    views: 0,
    sales: 0,
    tags: ["shirt", "casual", "cotton"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Black Denim Jacket",
    slug: "black-denim-jacket",
    description: "Classic denim jacket in black",
    longDescription: "A timeless denim jacket that never goes out of style. Perfect for layering in any season.",
    basePrice: 3499,
    salePrice: 2799,
    isOnSale: true,
    isFeatured: false,
    isNew: false,
    gender: "UNISEX",
    categoryId: "jackets",
    brandId: "clothify",
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500", alt: "Denim Jacket", order: 0, isPrimary: true }
    ],
    variants: [
      { size: "S", color: "Black", colorHex: "#000000", stock: 25, sku: "DJK-BLK-S", price: null },
      { size: "M", color: "Black", colorHex: "#000000", stock: 35, sku: "DJK-BLK-M", price: null },
      { size: "L", color: "Black", colorHex: "#000000", stock: 30, sku: "DJK-BLK-L", price: null }
    ],
    rating: 4.5,
    reviewCount: 20,
    views: 0,
    sales: 0,
    tags: ["denim", "jacket", "casual"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Cotton Polo Shirt",
    slug: "cotton-polo-shirt",
    description: "Classic polo shirt in multiple colors",
    longDescription: "A versatile polo shirt that works for both casual and semi-formal occasions. Made from breathable cotton.",
    basePrice: 1799,
    salePrice: null,
    isOnSale: false,
    isFeatured: false,
    isNew: true,
    gender: "MEN",
    categoryId: "shirts",
    brandId: "clothify",
    images: [
      { url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500", alt: "Polo Shirt", order: 0, isPrimary: true }
    ],
    variants: [
      { size: "S", color: "Navy", colorHex: "#000080", stock: 30, sku: "POL-NAV-S", price: null },
      { size: "M", color: "Navy", colorHex: "#000080", stock: 45, sku: "POL-NAV-M", price: null },
      { size: "L", color: "Navy", colorHex: "#000080", stock: 40, sku: "POL-NAV-L", price: null }
    ],
    rating: 4.3,
    reviewCount: 16,
    views: 0,
    sales: 0,
    tags: ["polo", "casual", "cotton"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Maxi Summer Dress",
    slug: "maxi-summer-dress",
    description: "Elegant maxi dress for summer occasions",
    longDescription: "This flowing maxi dress is perfect for summer events. Features a comfortable fit and beautiful design.",
    basePrice: 4499,
    salePrice: 3499,
    isOnSale: true,
    isFeatured: true,
    isNew: true,
    gender: "WOMEN",
    categoryId: "dresses",
    brandId: "clothify",
    images: [
      { url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500", alt: "Maxi Dress", order: 0, isPrimary: true }
    ],
    variants: [
      { size: "S", color: "Blue", colorHex: "#87CEEB", stock: 22, sku: "MAX-BLU-S", price: null },
      { size: "M", color: "Blue", colorHex: "#87CEEB", stock: 38, sku: "MAX-BLU-M", price: null },
      { size: "L", color: "Blue", colorHex: "#87CEEB", stock: 32, sku: "MAX-BLU-L", price: null }
    ],
    rating: 4.7,
    reviewCount: 28,
    views: 0,
    sales: 0,
    tags: ["dress", "maxi", "summer"],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
]

async function seedProducts() {
  try {
    console.log('🌱 Starting to seed products...')

    // First, create categories if they don't exist
    const categories = [
      { id: 'tshirts', name: 'T-Shirts', slug: 'tshirts', description: 'Comfortable t-shirts for everyday wear' },
      { id: 'shirts', name: 'Shirts', slug: 'shirts', description: 'Casual and formal shirts' },
      { id: 'jeans', name: 'Jeans', slug: 'jeans', description: 'Denim jeans in various fits' },
      { id: 'dresses', name: 'Dresses', slug: 'dresses', description: 'Beautiful dresses for all occasions' },
      { id: 'jackets', name: 'Jackets', slug: 'jackets', description: 'Stylish jackets and outerwear' },
      { id: 'accessories', name: 'Accessories', slug: 'accessories', description: 'Fashion accessories' },
    ]

    for (const category of categories) {
      await db.collection('categories').doc(category.id).set({
        ...category,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { merge: true })
      console.log(`✅ Category created: ${category.name}`)
    }

    // Create brand if it doesn't exist
    await db.collection('brands').doc('clothify').set({
      name: 'Clothify',
      slug: 'clothify',
      description: 'Premium fashion brand',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, { merge: true })
    console.log('✅ Brand created: Clothify')

    // Seed products
    for (const product of mockProducts) {
      const { variants, images, ...productData } = product
      
      // Add product
      const productRef = db.collection('products').doc()
      await productRef.set({
        ...productData,
        variants: variants,
        images: images,
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      // Add variants as subcollection
      for (const variant of variants) {
        await productRef.collection('variants').doc().set({
          ...variant,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }

      // Store images in product (Firestore doesn't support nested arrays well)
      await productRef.update({
        images: images,
      })

      console.log(`✅ Product created: ${product.name}`)
    }

    console.log('🎉 Successfully seeded all products!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()

