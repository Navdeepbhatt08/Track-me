import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatCurrency, cx } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

function StatCard({ label, value, type }) {
  return (
    <Card className="p-5 cursor-default" hover>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={cx(
        "text-2xl font-bold mt-1",
        type === 'income' ? 'text-green-600' : type === 'expense' ? 'text-red-600' : 'text-gray-900'
      )}>
        {value}
      </p>
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
    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

    const budget = Number(settings.monthlyBudget || 0)
    const budgetUsed = budget > 0 ? Math.min(100, Math.round((expense / budget) * 100)) : 0

    return { income, expense, balance, topCategory, budget, budgetUsed }
  }, [transactions, settings.monthlyBudget])

  const recent = transactions
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 5)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {settings.name}</p>
        </div>
        <div className="flex gap-2">
          <Button as={Link} to="/transactions" variant="secondary">
            View All
          </Button>
          <Button as={Link} to="/add" variant="primary">
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Balance" value={formatCurrency(stats.balance, settings.currency)} />
        <StatCard label="Income" value={formatCurrency(stats.income, settings.currency)} type="income" />
        <StatCard label="Expenses" value={formatCurrency(stats.expense, settings.currency)} type="expense" />
        <StatCard label="Top Category" value={stats.topCategory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Link to="/transactions" className="text-blue-600 hover:text-blue-700 text-sm">
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 mb-2">No transactions yet</p>
              <Link to="/add" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Add your first transaction
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Title</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Category</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-right py-2 text-sm font-medium text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className={cx(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-colors",
                            t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          )}>
                            {t.title.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{t.title}</p>
                            <p className="text-xs text-gray-500">{t.method}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-sm">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs">{t.category}</span>
                      </td>
                      <td className="py-3 text-sm text-gray-600">{t.date}</td>
                      <td className={cx(
                        "py-3 text-right font-semibold",
                        t.type === 'income' ? 'text-green-600' : 'text-gray-900'
                      )}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, settings.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-5" hover>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold">Budget</h2>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Used</span>
              <span className="font-semibold">{stats.budgetUsed}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={cx(
                  "h-full rounded-full transition-all duration-500",
                  stats.budgetUsed >= 90 ? "bg-red-500" : stats.budgetUsed >= 75 ? "bg-yellow-500" : "bg-blue-600"
                )}
                style={{ width: `${stats.budgetUsed}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Spent: <span className="font-medium text-gray-900">{formatCurrency(stats.expense, settings.currency)}</span></span>
            <span className="text-gray-600">Budget: <span className="font-medium text-gray-900">{formatCurrency(stats.budget, settings.currency)}</span></span>
          </div>
          <div className={cx(
            "mt-4 p-3 rounded-lg text-sm font-medium",
            stats.budgetUsed >= 90 ? "bg-red-50 text-red-700" : stats.budgetUsed >= 75 ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"
          )}>
            {stats.budgetUsed >= 90 ? "⚠️ Near budget limit" : stats.budgetUsed >= 75 ? "⚡ Getting close to limit" : "✓ On track with budget"}
          </div>
        </Card>
      </div>
    </div>
  )
}