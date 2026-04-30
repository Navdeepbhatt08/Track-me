import React from 'react'
import { cx } from '../../lib/utils'

export default function Card({ children, className, variant = 'default' }) {
  const variants = {
    default: 'bg-white border-surface-200 shadow-sm',
    glass: 'bg-white border-surface-200 shadow-sm',
    outline: 'bg-transparent border-surface-200',
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

