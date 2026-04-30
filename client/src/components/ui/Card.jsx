import React from 'react'
import { cx } from '../../lib/utils'

export default function Card({ children, className }) {
  return (
    <div className={cx('bg-white border border-gray-200 rounded-lg shadow-sm', className)}>
      {children}
    </div>
  )
}

