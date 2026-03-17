import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../state/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Login
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Welcome back. Continue tracking your expenses.
        </p>
      </div>

      <Card className="mt-6 p-5">
        {error ? (
          <div className="mb-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-800 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-200 dark:ring-rose-500/20">
            {error}
          </div>
        ) : null}

        <form
          className="space-y-4"
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
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Email or Name
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
              placeholder="demo@example.com or Demo User"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
          Don’t have an account?{' '}
          <Link className="font-semibold" to="/signup">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  )
}

