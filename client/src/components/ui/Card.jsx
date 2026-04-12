import React from 'react'
import { cx } from '../../lib/utils'

export default function Card({ children, className, variant = 'default' }) {
  const variants = {
    default: 'bg-white border-surface-200 dark:bg-surface-900/50 dark:border-surface-800 shadow-premium',
    glass: 'glass-card',
    outline: 'bg-transparent border-surface-200 dark:border-surface-800',
  }

  return (
    <div
      className={cx(
        'overflow-hidden rounded-3xl border transition-all duration-300',
        variants[variant],
        className,
      )}
    >
      {children}
    </div>
  )
}

