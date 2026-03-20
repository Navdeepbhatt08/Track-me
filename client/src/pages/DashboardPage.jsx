import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatCurrency } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

function StatCard({ label, value, badge }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        {badge}
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { state } = useExpense()
  const { transactions, settings } = state

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    const balance = income - expense

    const byCategory = transactions.reduce((acc, t) => {
      if (t.type !== 'expense') return acc
      const key = t.category || 'Other'
      acc[key] = (acc[key] || 0) + Number(t.amount || 0)
      return acc
    }, {})
    const topCategory =
      Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

    const budget = Number(settings.monthlyBudget || 0)
    const budgetUsed = budget > 0 ? Math.min(100, Math.round((expense / budget) * 100)) : 0

    return { income, expense, balance, topCategory, budget, budgetUsed }
  }, [transactions, settings.monthlyBudget])

  const recent = transactions
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 6)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 dark:text-white">
            Welcome back,{' '}
            <span className="text-slate-900 dark:text-slate-100">{settings.name}</span>
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-white">
            Quick snapshot of your spending and income.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button as={Link} to="/add" variant="primary">
            Add Transaction
          </Button>
          <Button as={Link} to="/transactions" variant="secondary">
            View Transactions
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
        <StatCard
          label="Balance"
          value={formatCurrency(stats.balance, settings.currency)}
          badge={
            <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 ring-1 ring-slate-100">
              Net
            </span>
          }
        />
        <StatCard
          label="Income"
          value={formatCurrency(stats.income, settings.currency)}
          badge={
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
              + In
            </span>
          }
        />
        <StatCard
          label="Expenses"
          value={formatCurrency(stats.expense, settings.currency)}
          badge={
            <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-800 ring-1 ring-rose-100">
              - Out
            </span>
          }
        />
        <StatCard
          label="Top category"
          value={stats.topCategory}
          badge={
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 ring-1 ring-blue-100">
              Focus
            </span>
          }
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Recent transactions
              </h2>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-white">
                Latest activity across categories.
              </p>
            </div>
            <Link
              to="/transactions"
              className="text-sm font-semibold text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              See all
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-white">
                  <th className="py-3 pr-4">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="py-3 pl-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td className="py-4 text-sm text-slate-600 dark:text-white" colSpan={4}>
                      No transactions yet. Add your first one from{' '}
                      <Link className="font-semibold text-blue-700 dark:text-blue-300" to="/add">
                        Add Transaction
                      </Link>
                      .
                    </td>
                  </tr>
                ) : (
                  recent.map((t) => (
                    <tr key={t.id} className="border-t border-slate-100 text-sm dark:border-white/10">
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</div>
                        <div className="text-xs text-slate-500 dark:text-white">{t.method}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-white">{t.date}</td>
                      <td
                        className={`py-3 pl-4 text-right font-semibold tabular-nums ${t.type === 'income' ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatCurrency(t.amount, settings.currency)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Monthly budget</h2>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-white">
            Track progress against your budget.
          </p>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">Used</span>
              <span className="font-semibold text-slate-900">{stats.budgetUsed}%</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${stats.budgetUsed >= 90 ? 'bg-rose-500' : 'bg-blue-600'
                  }`}
                style={{ width: `${stats.budgetUsed}%` }}
              />
            </div>
            <div className="mt-3 text-sm text-slate-600 dark:text-white">
              Budget:{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(stats.budget, settings.currency)}
              </span>
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-white">
              Spent:{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(stats.expense, settings.currency)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Button as={Link} to="/reports" variant="secondary" className="flex-1">
              Reports
            </Button>
            <Button as={Link} to="/settings" variant="secondary" className="flex-1">
              Settings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

