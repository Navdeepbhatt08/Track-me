import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { cx } from '../lib/utils'
import { useTheme } from '../state/ThemeContext.jsx'
import { useAuth } from '../state/AuthContext.jsx'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function ThemeSwitch({ theme, toggleTheme }) {
  const isDark = theme === 'dark'
  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-surface-200 bg-white shadow-sm transition-all hover:bg-surface-50 dark:border-surface-800 dark:bg-surface-900 dark:hover:bg-surface-800"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <div className="text-surface-600 dark:text-surface-400">
        {isDark ? <MoonIcon /> : <SunIcon />}
      </div>
    </button>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
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
    <header className="sticky top-0 z-50 px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="glass flex h-16 items-center justify-between rounded-[2rem] px-6 shadow-premium ring-1 ring-white/10">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 transition-transform active:scale-95"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="font-display text-lg font-extrabold tracking-tighter">TM</span>
            </div>
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="font-display text-sm font-bold tracking-tight text-surface-900 dark:text-surface-50">
                TrackMe
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                Premium
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/'}
                className={({ isActive }) =>
                  cx(
                    'rounded-xl px-4 py-2 text-sm font-semibold tracking-tight transition-all duration-200',
                    isActive
                      ? 'bg-brand-600/10 text-brand-600 dark:bg-brand-400/10 dark:text-brand-400'
                      : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900 dark:text-surface-400 dark:hover:bg-surface-800/60 dark:hover:text-surface-200',
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
            
            <div className="h-6 w-px bg-surface-200 dark:bg-surface-800 mx-1 hidden md:block" />

            {isAuthed ? (
              <button
                type="button"
                className="hidden rounded-2xl bg-surface-900 px-5 py-2.5 text-sm font-bold tracking-tight text-white transition-all hover:bg-surface-800 active:scale-95 md:inline-flex dark:bg-surface-100 dark:text-surface-950 dark:hover:bg-white"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-2xl bg-brand-600 px-5 py-2.5 text-sm font-bold tracking-tight text-white transition-all hover:bg-brand-700 active:scale-95 md:inline-flex"
              >
                Sign In
              </Link>
            )}

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-surface-200 bg-white transition-all hover:bg-surface-50 md:hidden dark:border-surface-800 dark:bg-surface-900 dark:hover:bg-surface-800"
              onClick={() => setOpen((v) => !v)}
            >
              <div className="flex flex-col gap-1.5">
                <span className={cx('h-0.5 w-5 bg-surface-600 transition-all dark:bg-surface-400', open && 'translate-y-2 rotate-45')} />
                {!open && <span className="h-0.5 w-5 bg-surface-600 dark:bg-surface-400" />}
                <span className={cx('h-0.5 w-5 bg-surface-600 transition-all dark:bg-surface-400', open && '-translate-y-0.5 -rotate-45')} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cx('overflow-hidden transition-all duration-300 md:hidden', open ? 'mt-4 max-h-[400px] opacity-100' : 'max-h-0 opacity-0')}>
        <div className="glass rounded-[2rem] p-4 shadow-xl ring-1 ring-white/10">
          <div className="flex flex-col gap-1">
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'flex items-center justify-between rounded-2xl px-5 py-3 text-sm font-bold tracking-tight transition-all',
                    isActive
                      ? 'bg-brand-600 text-white'
                      : 'text-surface-700 hover:bg-surface-50 dark:text-surface-200 dark:hover:bg-surface-800/60',
                  )
                }
              >
                {it.label}
              </NavLink>
            ))}
            <div className="mt-2 h-px bg-surface-200 dark:bg-surface-800" />
            <button
              onClick={() => { handleLogout(); setOpen(false) }}
              className="mt-2 flex items-center justify-between rounded-2xl px-5 py-3 text-sm font-bold tracking-tight text-red-500 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}