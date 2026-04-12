import React from 'react'
import { cx } from '../../lib/utils'

export default function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) {
  const variants = {
    primary:
      'bg-brand-600 text-white shadow-brand-600/20 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/30 active:scale-95',
    secondary:
      'bg-white text-surface-900 border border-surface-200 hover:bg-surface-50 hover:border-surface-300 dark:bg-surface-900 dark:text-surface-100 dark:border-surface-800 dark:hover:bg-surface-800/80 active:scale-95',
    outline:
      'bg-transparent text-brand-600 border-2 border-brand-600/20 hover:border-brand-600/50 hover:bg-brand-50 dark:text-brand-400 dark:border-brand-400/20 dark:hover:bg-brand-400/10 active:scale-95',
    danger:
      'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/30 active:scale-95',
    ghost:
      'bg-transparent text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800 focus:ring-0',
  }

  const sizes = {
    sm: 'px-3.5 py-1.5 text-xs rounded-xl',
    md: 'px-5 py-2.5 text-sm rounded-2xl',
    lg: 'px-7 py-3.5 text-base rounded-3xl',
  }

  return (
    <Comp
      className={cx(
        'relative inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/40 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      )}
      {...props}
    />
  )
}

