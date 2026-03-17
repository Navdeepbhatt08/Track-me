import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const KEY = 'expense_tracker_auth_v1'
const USERS_KEY = 'expense_tracker_users_v1'

function readStored() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { token: null, user: null }
    const parsed = JSON.parse(raw)
    return { token: parsed.token ?? null, user: parsed.user ?? null }
  } catch {
    return { token: null, user: null }
  }
}

function writeStored(next) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // ignore
  }
}

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    // ignore
  }
}

function seedDummyUsersIfMissing() {
  const existing = readUsers()
  if (existing.length > 0) return
  writeUsers([
    { id: 'u1', name: 'Demo User', email: 'demo@example.com', password: 'demo1234' },
    { id: 'u2', name: 'Nav', email: 'nav@example.com', password: 'nav1234' },
    { id: 'u3', name: 'Admin', email: 'admin@example.com', password: 'admin1234' },
  ])
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStored().token)
  const [user, setUser] = useState(() => readStored().user)

  useEffect(() => {
    seedDummyUsersIfMissing()
  }, [])

  useEffect(() => {
    writeStored({ token, user })
  }, [token, user])

  const api = useMemo(() => {
    async function signup({ name, email, password }) {
      if (!name || !email || !password) throw new Error('Missing name, email, or password')
      if (String(password).length < 6) throw new Error('Password must be at least 6 characters')

      const users = readUsers()
      const normalizedEmail = String(email).trim().toLowerCase()
      const existing = users.find((u) => String(u.email).toLowerCase() === normalizedEmail)
      if (existing) throw new Error('User already exists with this email')

      const nextUser = {
        id: `u_${Date.now()}`,
        name: String(name).trim(),
        email: normalizedEmail,
        password: String(password),
      }
      writeUsers([...users, nextUser])

      const authedUser = { id: nextUser.id, name: nextUser.name, email: nextUser.email }
      setToken(`local:${nextUser.id}`)
      setUser(authedUser)
      return { token: `local:${nextUser.id}`, user: authedUser }
    }

    async function login({ email, password }) {
      const identifier = String(email ?? '').trim()
      const pass = String(password ?? '')
      if (!identifier || !pass) throw new Error('Missing email/name or password')

      const users = readUsers()
      const idLower = identifier.toLowerCase()
      const match = users.find((u) => {
        const emailMatch = String(u.email ?? '').toLowerCase() === idLower
        const nameMatch = String(u.name ?? '').toLowerCase() === idLower
        return (emailMatch || nameMatch) && String(u.password ?? '') === pass
      })
      if (!match) throw new Error('Invalid credentials')

      const authedUser = { id: match.id, name: match.name, email: match.email }
      setToken(`local:${match.id}`)
      setUser(authedUser)
      return { token: `local:${match.id}`, user: authedUser }
    }

    function logout() {
      setToken(null)
      setUser(null)
    }

    return { token, user, isAuthed: Boolean(user), signup, login, logout }
  }, [token, user])

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

