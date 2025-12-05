// Script to make a user an admin
// Run with: npx tsx scripts/make-admin.ts <user-email>
// 
// ALTERNATIVE: Use the web interface at /admin/make-admin (no Admin SDK needed)

import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Check if environment variables are set
if (!process.env.FIREBASE_ADMIN_PROJECT_ID || 
    !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || 
    !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
  console.error('❌ Firebase Admin credentials not found in environment variables!')
  console.error('')
  console.error('Please set these in your .env.local file:')
  console.error('  FIREBASE_ADMIN_PROJECT_ID="your-project-id"')
  console.error('  FIREBASE_ADMIN_CLIENT_EMAIL="your-service-account@email.com"')
  console.error('  FIREBASE_ADMIN_PRIVATE_KEY="your-private-key"')
  console.error('')
  console.error('OR use the web interface instead:')
  console.error('  1. Sign up at /auth/signup')
  console.error('  2. Go to /admin/make-admin')
  console.error('  3. Enter your email and click "Make Admin"')
  process.exit(1)
}

// Initialize Firebase Admin
let app
if (getApps().length === 0) {
  try {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    })
  } catch (error: any) {
    console.error('❌ Failed to initialize Firebase Admin:', error.message)
    console.error('')
    console.error('Please check your credentials in .env.local')
    console.error('')
    console.error('OR use the web interface at /admin/make-admin instead')
    process.exit(1)
  }
} else {
  app = getApps()[0]
}

const db = getFirestore(app)

async function makeAdmin(userEmail: string) {
  try {
    console.log(`🔍 Looking for user with email: ${userEmail}`)

    // Find user by email
    const usersSnapshot = await db.collection('users')
      .where('email', '==', userEmail)
      .limit(1)
      .get()

    if (usersSnapshot.empty) {
      console.log('❌ User not found. Please sign up first at /auth/signup')
      console.log('   Then run this script again with your email.')
      process.exit(1)
    }

    const userDoc = usersSnapshot.docs[0]
    const userId = userDoc.id

    // Update user role to ADMIN
    await db.collection('users').doc(userId).update({
      role: 'ADMIN',
      updatedAt: new Date(),
    })

    console.log(`✅ User ${userEmail} is now an ADMIN!`)
    console.log(`   You can now access /admin`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error making user admin:', error)
    process.exit(1)
  }
}

const userEmail = process.argv[2]

if (!userEmail) {
  console.log('Usage: npx tsx scripts/make-admin.ts <user-email>')
  console.log('Example: npx tsx scripts/make-admin.ts admin@example.com')
  process.exit(1)
}

makeAdmin(userEmail)

