import React from 'react'
import Navbar from './navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-surface-50 text-surface-900">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        {children}
      </main>
    </div>
  )
}

