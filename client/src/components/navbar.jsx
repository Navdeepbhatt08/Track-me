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
    <header className="bg-white/90 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <span className="text-white font-bold text-sm">ET</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">Expense Tracker</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/'}
                className={({ isActive }) =>
                  cx(
                    'px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
            {isAuthed ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 rounded-lg transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-6 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </nav>

          <button
            className="md:hidden p-2 text-gray-400"
            onClick={() => setOpen(!open)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'block px-4 py-3 text-sm font-medium rounded-lg mx-2 mb-1 transition-all duration-200',
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
            {isAuthed ? (
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="w-full text-left px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 rounded-lg mx-2 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-blue-600 mx-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
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
