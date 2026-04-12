import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../state/AuthContext'

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
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
            Join TrackMe
          </h1>
          <p className="mt-4 text-base font-medium text-surface-500 dark:text-surface-400">
            Start your journey towards professional financial management.
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
                await signup({ name, email, password })
                navigate('/')
              } catch (err) {
                setError(err.message || 'Signup failed')
              } finally {
                setLoading(false)
              }
            }}
          >
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder="e.g. John Doe"
            />

            <Input
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
            />
            
            <Input
              label="Access Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
            />

            <Button type="submit" variant="primary" className="w-full py-4 text-base" disabled={loading}>
              {loading ? 'Creating Account...' : 'Get Started'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-surface-500 dark:text-surface-400">
              Already a member?{' '}
              <Link className="font-bold text-brand-600 dark:text-brand-400 hover:underline" to="/login">
                Sign in instead
              </Link>
            </p>
          </div>
        </Card>
        
        <p className="mt-8 text-center text-xs text-surface-400">
          By signing up, you agree to our <Link to="#" className="underline">Terms of Service</Link> and <Link to="#" className="underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}

