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
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500/50',
    secondary:
      'bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 focus:ring-blue-500/40 dark:bg-slate-900/60 dark:text-slate-100 dark:ring-white/10 dark:hover:bg-slate-900',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500/40',
    ghost:
      'bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-blue-500/40 dark:text-slate-100 dark:hover:bg-white/10',
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm rounded-xl',
    md: 'px-4 py-2.5 text-sm rounded-xl',
  }

  return (
    <Comp
      className={cx(
        'inline-flex items-center justify-center font-semibold shadow-sm transition focus:outline-none focus:ring-2',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      )}
      {...props}
    />
  )
}

