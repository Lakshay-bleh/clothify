// Firestore utility functions
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryConstraint,
  DocumentData,
  Timestamp,
} from 'firebase/firestore'
import { db } from './firebase'

// Collection references
export const collections = {
  users: 'users',
  products: 'products',
  categories: 'categories',
  brands: 'brands',
  orders: 'orders',
  carts: 'carts',
  wishlists: 'wishlists',
  addresses: 'addresses',
  coupons: 'coupons',
  reviews: 'reviews',
}

// Generic CRUD operations

export async function getDocument<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    }
    return null
  } catch (error) {
    console.error('Error getting document:', error)
    throw error
  }
}

export async function getDocuments<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), ...constraints)
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[]
  } catch (error) {
    console.error('Error getting documents:', error)
    throw error
  }
}

export async function addDocument<T = DocumentData>(
  collectionName: string,
  data: Partial<T>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding document:', error)
    throw error
  }
}

export async function updateDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}

// Product-specific functions

export async function getProducts(filters: {
  category?: string
  brand?: string
  gender?: string
  minPrice?: number
  maxPrice?: number
  limit?: number
  orderByField?: string
}) {
  const constraints: QueryConstraint[] = []
  
  if (filters.category) {
    constraints.push(where('categoryId', '==', filters.category))
  }
  
  if (filters.brand) {
    constraints.push(where('brandId', '==', filters.brand))
  }
  
  if (filters.gender) {
    constraints.push(where('gender', '==', filters.gender))
  }
  
  if (filters.minPrice !== undefined) {
    constraints.push(where('basePrice', '>=', filters.minPrice))
  }
  
  if (filters.maxPrice !== undefined) {
    constraints.push(where('basePrice', '<=', filters.maxPrice))
  }
  
  if (filters.orderByField) {
    constraints.push(orderBy(filters.orderByField, 'desc'))
  } else {
    constraints.push(orderBy('createdAt', 'desc'))
  }
  
  if (filters.limit) {
    constraints.push(limit(filters.limit))
  }
  
  return getDocuments(collections.products, constraints)
}

export async function getProductBySlug(slug: string) {
  const products = await getDocuments(
    collections.products,
    [where('slug', '==', slug), limit(1)]
  )
  return products[0] || null
}

// Cart functions

export async function getCart(userId: string) {
  const cartRef = doc(db, collections.carts, userId)
  const cartSnap = await getDoc(cartRef)
  
  if (cartSnap.exists()) {
    return cartSnap.data()
  }
  return { items: [] }
}

export async function addToCart(userId: string, item: any) {
  const cartRef = doc(db, collections.carts, userId)
  const cartSnap = await getDoc(cartRef)
  
  const existingCart = cartSnap.exists() ? cartSnap.data() : { items: [] }
  const items = existingCart.items || []
  
  const existingItemIndex = items.findIndex(
    (i: any) => i.variantId === item.variantId
  )
  
  if (existingItemIndex >= 0) {
    items[existingItemIndex].quantity += 1
  } else {
    items.push({ ...item, quantity: 1 })
  }
  
  await updateDoc(cartRef, {
    items,
    updatedAt: Timestamp.now(),
  })
}

// Wishlist functions

export async function getWishlist(userId: string) {
  const wishlistRef = doc(db, collections.wishlists, userId)
  const wishlistSnap = await getDoc(wishlistRef)
  
  if (wishlistSnap.exists()) {
    return wishlistSnap.data()
  }
  return { items: [] }
}

export async function addToWishlist(userId: string, productId: string) {
  const wishlistRef = doc(db, collections.wishlists, userId)
  const wishlistSnap = await getDoc(wishlistRef)
  
  const existingWishlist = wishlistSnap.exists() ? wishlistSnap.data() : { items: [] }
  const items = existingWishlist.items || []
  
  if (!items.includes(productId)) {
    items.push(productId)
  }
  
  await updateDoc(wishlistRef, {
    items,
    updatedAt: Timestamp.now(),
  })
}

// Order functions

export async function getUserOrders(userId: string) {
  return getDocuments(
    collections.orders,
    [where('userId', '==', userId), orderBy('createdAt', 'desc')]
  )
}

export async function createOrder(orderData: any) {
  return addDocument(collections.orders, orderData)
}

// Helper to convert Firestore Timestamp to Date
export function timestampToDate(timestamp: any): Date {
  if (timestamp?.toDate) {
    return timestamp.toDate()
  }
  return new Date(timestamp)
}

