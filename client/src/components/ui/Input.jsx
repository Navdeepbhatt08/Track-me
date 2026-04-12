import React from 'react'
import { cx } from '../../lib/utils'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
          {label}
        </label>
      ) }
      <input
        className={cx(
          'block w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/10',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10 dark:border-red-500/50',
          className
        )}
        {...props}
      />
      {error && (
        <p className="ml-1 text-xs font-medium text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
