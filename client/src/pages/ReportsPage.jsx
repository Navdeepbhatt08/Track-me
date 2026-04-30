import React, { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import { cx, formatCurrency } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

function monthKey(dateStr) {
  if (!dateStr) return ''
  return String(dateStr).slice(0, 7)
}

export default function ReportsPage() {
  const { state } = useExpense()
  const { transactions, settings } = state

  const months = useMemo(() => {
    const set = new Set(transactions.map((t) => monthKey(t.date)).filter(Boolean))
    return Array.from(set).sort().reverse()
  }, [transactions])

  const [selectedMonth, setSelectedMonth] = useState(() => months[0] ?? '')

  const data = useMemo(() => {
    const items = selectedMonth
      ? transactions.filter((t) => monthKey(t.date) === selectedMonth)
      : transactions

    const income = items
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    const expense = items
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const byCategory = items.reduce((acc, t) => {
      if (t.type !== 'expense') return acc
      const key = t.category || 'Other'
      acc[key] = (acc[key] || 0) + Number(t.amount || 0)
      return acc
    }, {})

    const total = Object.values(byCategory).reduce((a, b) => a + b, 0)
    const rows = Object.entries(byCategory)
      .map(([cat, amt]) => ({
        cat,
        amt,
        pct: total > 0 ? Math.round((amt / total) * 100) : 0,
      }))
      .sort((a, b) => b.amt - a.amt)

    return { items, income, expense, rows, total }
  }, [transactions, selectedMonth])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">View your financial summary</p>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
        >
          <option value="">All time</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 cursor-default" hover>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.income, settings.currency)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 cursor-default" hover>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(data.expense, settings.currency)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 cursor-default" hover>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Balance</p>
              <p className={cx(
                "text-2xl font-bold",
                (data.income - data.expense) >= 0 ? "text-blue-600" : "text-red-600"
              )}>
                {formatCurrency(data.income - data.expense, settings.currency)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Spending by Category</h2>

          {data.rows.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No expense data</p>
          ) : (
            <div className="space-y-4">
              {data.rows.map((r, i) => (
                <div key={r.cat} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cx(
                        'w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold',
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                          i === 1 ? 'bg-gray-200 text-gray-700' :
                            i === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-gray-100 text-gray-600'
                      )}>
                        {i + 1}
                      </span>
                      <span className="font-medium">{r.cat}</span>
                    </div>
                    <span className="text-gray-600">
                      {formatCurrency(r.amt, settings.currency)} <span className="text-gray-400">({r.pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={cx(
                        'h-full rounded-full transition-all duration-700 ease-out',
                        r.pct >= 50 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                          r.pct >= 25 ? 'bg-gradient-to-r from-blue-600 to-blue-400' :
                            'bg-gradient-to-r from-green-500 to-green-400'
                      )}
                      style={{ width: `${Math.max(3, r.pct)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-lg font-semibold mb-4">Summary</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-gray-600">Transactions</span>
              </div>
              <span className="font-semibold text-gray-900">{data.items.length}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-600">Monthly Budget</span>
              </div>
              <span className="font-semibold text-gray-900">{formatCurrency(settings.monthlyBudget, settings.currency)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-gray-600">Remaining</span>
              </div>
              <span className={cx(
                "font-bold text-lg",
                (Number(settings.monthlyBudget || 0) - data.expense) >= 0 ? "text-green-600" : "text-red-600"
              )}>
                {formatCurrency(Number(settings.monthlyBudget || 0) - data.expense, settings.currency)}
              </span>
            </div>
          </div>

          <div className={cx(
            "mt-4 p-4 rounded-lg text-sm font-medium flex items-center gap-2",
            data.expense > data.income ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          )}>
            <span className="text-lg">{data.expense > data.income ? "⚠️" : "✓"}</span>
            {data.expense > data.income
              ? "Spending exceeds income this period"
              : "You're saving money this period"}
          </div>
        </Card>
      </div>
    </div>
  )
}

