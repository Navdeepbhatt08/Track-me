import React from 'react'
import Navbar from './navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="space-y-8">
          {children}
        </div>
      </main>
    </div>
  )
}

