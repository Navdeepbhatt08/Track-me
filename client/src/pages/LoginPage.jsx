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
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <span className="text-white text-2xl font-bold">ET</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-1">Sign in to your account</p>
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
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              required
              placeholder="Enter your email"
            />

            <Input
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Enter your password"
            />

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link className="text-blue-600 hover:text-blue-700 font-medium" to="/signup">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

