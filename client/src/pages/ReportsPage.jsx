import React, { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import { cx, formatCurrency } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

function monthKey(dateStr) {
  if (!dateStr) return ''
  return String(dateStr).slice(0, 7) // YYYY-MM
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
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Reports
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Category breakdown and monthly summary.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
          >
            {months.length === 0 ? (
              <option value="">All time</option>
            ) : (
              <>
                <option value="">All time</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </>
            )}
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-600">Income</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(data.income, settings.currency)}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-600">Expenses</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(data.expense, settings.currency)}
          </div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-600">Net</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {formatCurrency(data.income - data.expense, settings.currency)}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Spending by category
          </h2>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            Based on expenses only.
          </p>

          <div className="mt-4 space-y-3">
            {data.rows.length === 0 ? (
              <div className="text-sm text-slate-600 dark:text-slate-400">No expense data yet.</div>
            ) : (
              data.rows.map((r) => (
                <div key={r.cat}>
                  <div className="flex items-center justify-between text-sm">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{r.cat}</div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(r.amt, settings.currency)} ({r.pct}%)
                    </div>
                  </div>
                  <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cx(
                        'h-full rounded-full',
                        r.pct >= 50 ? 'bg-rose-500' : r.pct >= 25 ? 'bg-blue-600' : 'bg-emerald-500',
                      )}
                      style={{ width: `${Math.max(2, r.pct)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Summary</h2>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
            Budget and quick numbers.
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-slate-600 dark:text-slate-400">Transactions</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">{data.items.length}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-600 dark:text-slate-400">Monthly budget</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(settings.monthlyBudget, settings.currency)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-slate-600 dark:text-slate-400">Budget remaining</div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(
                  Math.max(0, Number(settings.monthlyBudget || 0) - data.expense),
                  settings.currency,
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

