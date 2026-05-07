import React from 'react'
import { cx } from '../../lib/utils'

export default function Card({ children, className, hover = false }) {
  return (
    <div className={cx(
      'bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/50 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none backdrop-blur-md transition-all duration-300',
      hover && 'hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700',
      className
    )}>
      {children}
    </div>
  )
}

