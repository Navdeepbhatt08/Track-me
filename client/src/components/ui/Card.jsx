import React from 'react'
import { cx } from '../../lib/utils'

export default function Card({ className, children }) {
  return (
    <div
      className={cx(
        'rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-white/10',
        className,
      )}
    >
      {children}
    </div>
  )
}

