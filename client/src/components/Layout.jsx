import React from 'react'
import Navbar from './navbar'

export default function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-surface-50 text-surface-900 transition-colors duration-300 dark:bg-surface-950 dark:text-surface-50 overflow-x-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-full -translate-x-1/2 [background:radial-gradient(circle_at_center,_var(--brand-primary)_0%,_transparent_70%)] opacity-[0.03] dark:opacity-[0.07]" />
      <div className="absolute top-[20%] right-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-brand-500/10 blur-[120px]" />
      <div className="absolute bottom-[10%] left-[-5%] -z-10 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />
      
      <Navbar />
      <main className="relative z-0">
        {children}
      </main>
    </div>
  )
}

