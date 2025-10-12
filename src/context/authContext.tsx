import { createContext, useContext, useState, useEffect } from 'react'
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'

// User roles
export type UserRole = 'admin' | 'editor' | 'viewer'

export interface UserProfile {
  uid: string
  email: string
  role: UserRole
  displayName?: string
  createdAt: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, displayName?: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  hasRole: (role: UserRole | UserRole[]) => boolean
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuth must be used within a AuthProvider')
  
  return context
}

// Role Permissions
const rolePermissions: Record<UserRole, string[]> = {
  admin: ['read', 'write', 'delete', 'manage_users', 'upload_data'],
  editor: ['read', 'write', 'upload_data'],
  viewer: ['read']
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile
        return {
          uid,
          email: data.email,
          role: data.role || 'viewer',
          displayName: data.displayName,
          createdAt: data.createdAt instanceof Date ? data.createdAt : new Date()
        }
      }

      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Create user profile in Firestore
  const createUserProfile = async (user: User, displayName?: string, role: UserRole = 'viewer') => {
    try {
      const userRef = doc(db, 'users', user.uid)
      const profile: Omit<UserProfile, 'uid'> & { createdAt: Date } = {
        email: user.email!,
        role,
        displayName: displayName || user.displayName || undefined,
        createdAt: new Date()
      }
      
      await setDoc(userRef, profile)
      return { uid: user.uid, ...profile }
    } catch (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const profile = await fetchUserProfile(result.user.uid)
      setUserProfile(profile)
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  // Sign up 
  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const profile = await createUserProfile(result.user, displayName, 'viewer') // Default role is viewer
      
      setUserProfile(profile)
    } catch (error) {
      console.error('Error signing up:', error)
      throw new Error(error instanceof Error ? error.message : 'Sign up failed')
    }
  }


  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setUserProfile(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw new Error(error instanceof Error ? error.message : 'Sign out failed')
    }
  }


  // Reset password
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error) {
      console.error('Error resetting password:', error)
      throw new Error(error instanceof Error ? error.message : 'Password reset failed')
    }
  }


  // Check for user role
  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!userProfile) return false

    if (Array.isArray(role)) {
      return role.includes(userProfile.role)
    }

    return userProfile.role === role
  }

  // Check for user's permissions
  const hasPermission = (permission: string): boolean => {
    if (!userProfile) return false

    return (rolePermissions[userProfile.role] || []).includes(permission)
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    hasRole,
    hasPermission
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}