import React from 'react'
import { cx } from '../../lib/utils'

export default function Card({ children, className, hover = false }) {
  return (
    <div className={cx(
      'bg-white border border-gray-200 rounded-xl shadow-lg transition-all duration-300',
      hover && 'hover:shadow-xl hover:-translate-y-1 hover:border-gray-300',
      className
    )}>
      {children}
    </div>
  )
}

