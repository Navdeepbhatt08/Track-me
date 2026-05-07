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
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
    secondary: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700 shadow-sm',
    outline: 'border border-gray-300 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs rounded-lg font-medium',
    md: 'px-6 py-3 text-sm rounded-lg font-medium',
    lg: 'px-8 py-4 text-base rounded-lg font-medium',
  }

  return (
    <Comp
      className={cx(
        'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm active:scale-95',
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      )}
      {...props}
    />
  )
}

