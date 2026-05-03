import React from 'react'
import { cx } from '../../lib/utils'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={cx(
          'block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 focus:outline-none hover:border-gray-400 placeholder:text-gray-500 shadow-sm',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  )
}
