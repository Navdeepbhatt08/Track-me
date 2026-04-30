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
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
    outline: 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-md',
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

