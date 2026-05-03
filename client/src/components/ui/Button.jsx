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
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300 shadow-sm',
    outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
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

