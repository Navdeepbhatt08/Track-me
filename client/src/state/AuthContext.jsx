import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { authAPI } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.me()
        setUser(response.user)
      } catch (err) {
        console.log(err);
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const api = useMemo(() => {
    async function signup({ name, email, password, phone, agreeTerms }) {
      try {
        setLoading(true)
        setError(null)

        if (!name || !email || !password) throw new Error('Missing name, email, or password')
        if (String(password).length < 6) throw new Error('Password must be at least 6 characters')
        if (!agreeTerms) throw new Error('You must agree to the terms and conditions')

        const response = await authAPI.signup(name, email, password, phone, agreeTerms)
        setUser(response.user)
        return response
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    }

    async function login({ email, password }) {
      try {
        setLoading(true)
        setError(null)

        const identifier = String(email ?? '').trim()
        const pass = String(password ?? '')
        if (!identifier || !pass) throw new Error('Missing email or password')

        const response = await authAPI.login(identifier, pass)
        setUser(response.user)
        return response
      } catch (err) {
        setError(err.message)
        throw err
      } finally {
        setLoading(false)
      }
    }

    async function logout() {
      try {
        await authAPI.logout()
      } catch (err) {
        console.error('Logout failed:', err)
      } finally {
        setUser(null)
        setError(null)
      }
    }

    function clearError() {
      setError(null)
    }

    return {
      user,
      isAuthed: Boolean(user),
      loading,
      error,
      signup,
      login,
      logout,
      clearError
    }
  }, [user, loading, error])

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

