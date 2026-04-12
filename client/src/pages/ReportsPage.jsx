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
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-surface-950 dark:text-white sm:text-5xl">
            Financial Analytics
          </h1>
          <p className="text-base font-medium text-surface-500 dark:text-surface-400">
            Deeper insights into your spending habits and income streams.
          </p>
        </div>

        <div className="w-full sm:w-64 space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
            Report Period
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="block w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
          >
            <option value="">All time history</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-8" variant="glass">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-surface-500">Period Income</div>
          <div className="mt-4 font-display text-3xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
            {formatCurrency(data.income, settings.currency)}
          </div>
          <div className="mt-2 text-xs font-bold text-surface-400">Total inward cashflow</div>
        </Card>
        
        <Card className="p-8" variant="glass">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-surface-500">Period Expenses</div>
          <div className="mt-4 font-display text-3xl font-black tracking-tight text-surface-950 dark:text-white">
            {formatCurrency(data.expense, settings.currency)}
          </div>
          <div className="mt-2 text-xs font-bold text-surface-400">Total outward spending</div>
        </Card>

        <Card className="p-8" variant="glass">
          <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-surface-500">Net Balance</div>
          <div className={cx(
            "mt-4 font-display text-3xl font-black tracking-tight",
            (data.income - data.expense) >= 0 ? "text-brand-600 dark:text-brand-400" : "text-red-600 dark:text-red-400"
          )}>
            {formatCurrency(data.income - data.expense, settings.currency)}
          </div>
          <div className="mt-2 text-xs font-bold text-surface-400">Current period savings</div>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="p-8" variant="default">
          <h2 className="text-xl font-extrabold tracking-tight text-surface-950 dark:text-white">
            Category Breakdown
          </h2>
          <p className="mt-1 text-sm font-medium text-surface-500">
            Based on outward expense activity only.
          </p>

          <div className="mt-10 space-y-8">
            {data.rows.length === 0 ? (
              <div className="py-12 text-center text-sm font-medium text-surface-400">No expense data for this period.</div>
            ) : (
              data.rows.map((r) => (
                <div key={r.cat} className="group">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="font-bold text-surface-900 dark:text-surface-100">{r.cat}</div>
                    <div className="font-display font-black text-surface-950 dark:text-white">
                      {formatCurrency(r.amt, settings.currency)} <span className="text-xs font-bold text-surface-400 ml-1">({r.pct}%)</span>
                    </div>
                  </div>
                  <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
                    <div
                      className={cx(
                        'h-full rounded-full transition-all duration-1000 group-hover:brightness-110',
                        r.pct >= 60 ? 'bg-red-500' : r.pct >= 25 ? 'bg-brand-600' : 'bg-emerald-500',
                      )}
                      style={{ width: `${Math.max(2, r.pct)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-8" variant="default">
          <h2 className="text-xl font-extrabold tracking-tight text-surface-950 dark:text-white">Summary Analytics</h2>
          <p className="mt-1 text-sm font-medium text-surface-500">
            Overview of your current budget performance.
          </p>

          <div className="mt-10 space-y-6">
            <div className="flex items-center justify-between py-4 border-b border-surface-50 dark:border-surface-800/50">
              <div className="text-sm font-bold text-surface-500 uppercase tracking-widest">Total Transactions</div>
              <div className="font-display text-lg font-black text-surface-950 dark:text-white">{data.items.length}</div>
            </div>
            
            <div className="flex items-center justify-between py-4 border-b border-surface-50 dark:border-surface-800/50">
              <div className="text-sm font-bold text-surface-500 uppercase tracking-widest">Defined Budget</div>
              <div className="font-display text-lg font-black text-surface-950 dark:text-white">
                {formatCurrency(settings.monthlyBudget, settings.currency)}
              </div>
            </div>

            <div className="flex items-center justify-between py-4">
              <div className="text-sm font-bold text-surface-500 uppercase tracking-widest">Budget Remaining</div>
              <div className={cx(
                "font-display text-2xl font-black",
                (Number(settings.monthlyBudget || 0) - data.expense) >= 0 ? "text-emerald-600" : "text-red-600"
              )}>
                {formatCurrency(
                  Number(settings.monthlyBudget || 0) - data.expense,
                  settings.currency,
                )}
              </div>
            </div>
            
            <div className="mt-6 rounded-[2rem] bg-surface-50 dark:bg-surface-900/50 p-6 border border-surface-100 dark:border-surface-800">
               <h4 className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-2">Pro Insight</h4>
               <p className="text-sm font-medium text-surface-600 dark:text-surface-300">
                  {data.expense > data.income 
                    ? "Warning: Your spending exceeds your income for this period. Consider reviewing your top categories."
                    : "Excellent! You are maintaining a healthy savings rate this period."}
               </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

