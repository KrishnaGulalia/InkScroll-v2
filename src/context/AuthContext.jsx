import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Effect 1: Listen for auth state changes — only set user (synchronous, no DB queries)
  useEffect(() => {
    let mounted = true

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AUTH INIT: session', session ? 'exists' : 'null')
      if (mounted) {
        setUser(session?.user ?? null)
        if (!session?.user) setLoading(false)
      }
    })

    // Listen for future auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AUTH EVENT:', event)
        if (!mounted) return
        
        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  // Effect 2: Fetch profile whenever user changes — runs AFTER auth token is applied
  useEffect(() => {
    if (!user?.id) return

    let cancelled = false

    const fetchProfile = async () => {
      console.log('PROFILE FETCH: starting for', user.id)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      console.log('PROFILE FETCH result:', { data: data?.username, error: error?.message })

      if (!cancelled && data) {
        setProfile(data)
      } else if (!cancelled && error) {
        // Retry once after short delay (Supabase token propagation)
        console.log('PROFILE FETCH: retrying...')
        await new Promise(r => setTimeout(r, 500))
        const { data: retryData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        console.log('PROFILE RETRY result:', retryData?.username)
        if (!cancelled && retryData) {
          setProfile(retryData)
        }
      }
      if (!cancelled) setLoading(false)
    }

    fetchProfile()

    return () => { cancelled = true }
  }, [user?.id])

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signUp = async ({ email, password, options }) => {
    const { data, error } = await supabase.auth.signUp({ email, password, options })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates) => {
    if (!user) return
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    
    if (!error && data) {
      setProfile(data)
    }
    return { data, error }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
