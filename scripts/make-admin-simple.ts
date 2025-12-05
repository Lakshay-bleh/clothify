// Simple script to make a user admin using client SDK
// This works if you're already signed in as that user
// Run in browser console or use the web interface

import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../lib/firebase'

// This function can be called from browser console
export async function makeUserAdmin(userEmail: string) {
  try {
    console.log(`🔍 Looking for user with email: ${userEmail}`)

    // Find user by email
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', userEmail))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      console.log('❌ User not found. Please sign up first at /auth/signup')
      return { success: false, error: 'User not found' }
    }

    const userDoc = querySnapshot.docs[0]
    const userId = userDoc.id

    // Update user role to ADMIN
    await updateDoc(doc(db, 'users', userId), {
      role: 'ADMIN',
      updatedAt: new Date(),
    })

    console.log(`✅ User ${userEmail} is now an ADMIN!`)
    console.log(`   Sign out and sign back in to access /admin`)
    return { success: true }
  } catch (error: any) {
    console.error('❌ Error making user admin:', error)
    return { success: false, error: error.message }
  }
}

// For browser console usage
if (typeof window !== 'undefined') {
  (window as any).makeUserAdmin = makeUserAdmin
  console.log('✅ makeUserAdmin function is available!')
  console.log('   Usage: await makeUserAdmin("your-email@example.com")')
}

