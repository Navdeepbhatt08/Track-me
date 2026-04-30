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
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-green-600/30">
            <span className="text-white text-2xl font-bold">ET</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-1">Get started with Expense Tracker</p>
        </div>

        <Card className="p-6 shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          <form
            className="space-y-4"
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
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              placeholder="Your name"
            />

            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              minLength={6}
              placeholder="Min 6 characters"
            />

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Sign Up'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link className="text-blue-600 hover:text-blue-700 font-medium" to="/login">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

