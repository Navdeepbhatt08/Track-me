import React from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './navbar'

export default function Layout({ children }) {
  const location = useLocation()
  const hideNavbar = location.pathname === '/login'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] transition-colors duration-300">
      {!hideNavbar && <Navbar />}
      <main className="mx-auto max-w-7xl px-6 pt-28 pb-12">
        <div className="space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}

