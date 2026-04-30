import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { cx } from '../lib/utils'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthed, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm("Logout?")) {
      logout()
      navigate('/login')
    }
  }

  const items = [
    { label: 'Dashboard', to: '/' },
    { label: 'Transactions', to: '/transactions' },
    { label: 'Add', to: '/add' },
    { label: 'Reports', to: '/reports' },
    { label: 'Settings', to: '/settings' },
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white font-bold text-sm">
              ET
            </div>
            <span className="font-semibold text-gray-900">Expense Tracker</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/'}
                className={({ isActive }) =>
                  cx(
                    'px-3 py-2 text-sm font-medium rounded-md',
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
            {isAuthed ? (
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-3 pt-3 border-t border-gray-200 space-y-1">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'block px-3 py-2 text-sm font-medium rounded-md',
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
            {isAuthed ? (
              <button
                onClick={() => { handleLogout(); setOpen(false) }}
                className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md text-center"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
