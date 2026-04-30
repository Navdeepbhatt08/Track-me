import React from 'react'
import { cx } from '../../lib/utils'

export default function Card({ children, className, hover = false }) {
  return (
    <div className={cx(
      'bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200',
      hover && 'hover:shadow-md hover:-translate-y-0.5',
      className
    )}>
      {children}
    </div>
  )
}

