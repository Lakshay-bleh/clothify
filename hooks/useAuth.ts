'use client';

import { useEffect, useState } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

interface UserProfile {
  id: string
  email: string | null
  name: string | null
  role: 'CUSTOMER' | 'ADMIN'
  image: string | null
  createdAt: Date
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setProfile({
            id: firebaseUser.uid,
            ...userDoc.data(),
          } as UserProfile)
        } else {
          // Create default profile if doesn't exist
          const defaultProfile = {
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            role: 'CUSTOMER' as const,
            image: firebaseUser.photoURL,
            createdAt: new Date(),
          }
          await setDoc(doc(db, 'users', firebaseUser.uid), defaultProfile)
          setProfile({
            id: firebaseUser.uid,
            ...defaultProfile,
          })
        }
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        name,
        role: 'CUSTOMER',
        image: null,
        createdAt: new Date(),
      })
      
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      
      // Check if user profile exists, create if not
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          name: result.user.displayName,
          role: 'CUSTOMER',
          image: result.user.photoURL,
          createdAt: new Date(),
        })
      }
      
      return { success: true, user: result.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'ADMIN',
  }
}

