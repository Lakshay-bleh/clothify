// Firebase Admin SDK for server-side operations
import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

let app: App

if (!getApps().length) {
  try {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  } catch (error) {
    console.error('Firebase admin initialization error:', error)
  }
} else {
  app = getApps()[0]
}

export const adminAuth = getAuth(app)
export const adminDb = getFirestore(app)
export const adminStorage = getStorage(app)

export default app

