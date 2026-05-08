import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './navbar'

export default function Layout({ children }) {
  const location = useLocation()
  const authPage = location.pathname === '/login' || location.pathname === '/signup'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-300">
      {!authPage && <Navbar />}
      <main className={`mx-auto max-w-7xl px-6 ${authPage ? 'py-0' : 'pt-28 pb-12'}`}>
        <div className="space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}

