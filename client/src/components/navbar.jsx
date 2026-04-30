import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { cx } from '../lib/utils'
import { useAuth } from '../state/AuthContext.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthed, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout()
      navigate('/login')
    }
  }

  const items = [
    { label: 'Overview', to: '/' },
    { label: 'Activity', to: '/transactions' },
    { label: 'Add', to: '/add' },
    { label: 'Analytics', to: '/reports' },
    { label: 'Settings', to: '/settings' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-surface-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex min-w-0 items-center gap-3 text-surface-900"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
            TM
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold">TrackMe</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-surface-500">Premium</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-2 md:flex" aria-label="Main">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/'}
                className={({ isActive }) =>
                  cx(
                    'rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150',
                    isActive ? 'bg-brand-100 text-brand-700' : 'text-surface-700 hover:bg-surface-100 hover:text-surface-900',
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
          </nav>

          {isAuthed ? (
            <button
              type="button"
              className="hidden rounded-lg bg-surface-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-surface-800 md:inline-flex"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 md:inline-flex"
            >
              Sign In
            </Link>
          )}

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-200 bg-white transition hover:bg-surface-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <div className="flex flex-col gap-1.5">
              <span className={cx('h-0.5 w-5 bg-surface-700 transition-transform', open && 'translate-y-2 rotate-45')} />
              {!open && <span className="h-0.5 w-5 bg-surface-700" />}
              <span className={cx('h-0.5 w-5 bg-surface-700 transition-transform', open && '-translate-y-0.5 -rotate-45')} />
            </div>
          </button>
        </div>

        <div className={cx('w-full overflow-hidden md:hidden', open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
          <div className="space-y-2 border-t border-surface-200 bg-white px-4 py-4">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'block rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive ? 'bg-brand-100 text-brand-700' : 'text-surface-700 hover:bg-surface-100',
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
            {isAuthed ? (
              <button
                onClick={() => { handleLogout(); setOpen(false) }}
                className="w-full rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
