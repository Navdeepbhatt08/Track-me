import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../state/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-600/10 text-brand-600 dark:bg-brand-400/10 dark:text-brand-400 mb-6 ring-1 ring-brand-600/20 shadow-xl shadow-brand-600/20">
             <span className="font-display text-2xl font-extrabold tracking-tighter">TM</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-surface-950 dark:text-white sm:text-5xl">
            Welcome Back
          </h1>
          <p className="mt-4 text-base font-medium text-surface-500 dark:text-surface-400">
            Sign in to your TrackMe account to manage your finances.
          </p>
        </div>

        <Card className="p-8 sm:p-10 border-white/20 dark:border-white/5" variant="default">
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-800 ring-1 ring-red-100 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20">
              {error}
            </div>
          )}

          <form
            className="space-y-6"
            onSubmit={async (e) => {
              e.preventDefault()
              setError('')
              setLoading(true)
              try {
                await login({ email, password })
                navigate('/')
              } catch (err) {
                setError(err.message || 'Login failed')
              } finally {
                setLoading(false)
              }
            }}
          >
            <Input
              label="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              required
              placeholder="Enter your email"
            />
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
                  Password
                </label>
                <Link to="#" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                className="block w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-4 text-base" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
              New to TrackMe?{' '}
              <Link className="font-bold text-brand-600 dark:text-brand-400 hover:underline" to="/signup">
                Create an account
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

