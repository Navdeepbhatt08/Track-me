import React, { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { cx } from '../lib/utils'
import { useTheme } from '../state/ThemeContext.jsx'
import { useAuth } from '../state/AuthContext.jsx'

const navLinkBase =
  'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition text-white'

function SunIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="8" cy="8" r="3" />
      <line x1="8" y1="1" x2="8" y2="3" />
      <line x1="8" y1="13" x2="8" y2="15" />
      <line x1="1" y1="8" x2="3" y2="8" />
      <line x1="13" y1="8" x2="15" y2="8" />
      <line x1="3.22" y1="3.22" x2="4.64" y2="4.64" />
      <line x1="11.36" y1="11.36" x2="12.78" y2="12.78" />
      <line x1="3.22" y1="12.78" x2="4.64" y2="11.36" />
      <line x1="11.36" y1="4.64" x2="12.78" y2="3.22" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13.5 10A6 6 0 0 1 6 2.5a6 6 0 1 0 7.5 7.5z" />
    </svg>
  )
}

function ThemeSwitch({ theme, toggleTheme }) {
  const isDark = theme === 'dark'
  return (
    <label
      className="flex cursor-pointer items-center gap-2"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <div
        onClick={toggleTheme}
        className={cx(
          'relative h-6 w-11 rounded-full transition-colors duration-200',
          isDark ? 'bg-slate-700' : 'bg-slate-200',
        )}
      >
        <div
          className={cx(
            'absolute top-[3px] left-[3px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white transition-transform duration-200',
            isDark
              ? 'translate-x-5 text-slate-600'
              : 'translate-x-0 text-slate-500',
          )}
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </div>
      </div>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </label>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { isAuthed, logout } = useAuth()
  const navigate = useNavigate()


  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logout();
      navigate('/login');
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
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3"
        >
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-extrabold text-white shadow-lg shadow-blue-600/20">
            ET
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold tracking-tight text-white-900 dark:text-gray-100">
              Expense Tracker
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Track • Budget • Save
            </div>
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
                  navLinkBase,
                  isActive
                    ? 'bg-blue-800 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/0',
                )
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthed ? (
            <button
              type="button"
              className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 md:inline-flex dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 md:inline-flex dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              Login
            </Link>
          )}

          <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 md:hidden dark:border-white/10 dark:bg-slate-900/60 dark:text-white dark:hover:bg-slate-900"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div className={cx('md:hidden', open ? 'block' : 'hidden')}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-4 sm:px-6">
          <div className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10">
            <div className="flex items-center justify-between gap-2 px-1 pb-2">
              {isAuthed ? (
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
                  onClick={() => { handleLogout(); setOpen(false) }}
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900"
                  onClick={() => setOpen(false)}
                >
                  Login
                </Link>
              )}
              <ThemeSwitch theme={theme} toggleTheme={toggleTheme} />
            </div>
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cx(
                    'flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-800 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/10',
                  )
                }
              >
                {it.label}
                <span className={cx('text-xs', it.to === '/add' ? 'opacity-100' : 'opacity-60')}>
                  →
                </span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}