import React from 'react'
import Navbar from './navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      {children}
    </div>
  )
}

