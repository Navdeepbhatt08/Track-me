import React from 'react'
import { cx } from '../../lib/utils'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={cx(
          'block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-none hover:border-gray-400',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
