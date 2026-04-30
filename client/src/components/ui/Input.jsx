import React from 'react'
import { cx } from '../../lib/utils'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[11px] font-semibold uppercase tracking-widest text-surface-600 ml-1">
          {label}
        </label>
      )}
      <input
        className={cx(
          'block w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {error && (
        <p className="ml-1 text-xs font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
