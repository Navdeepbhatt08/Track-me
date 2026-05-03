import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatCurrency, cx } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

function StatCard({ label, value, type }) {
  return (
    <Card className="p-5 cursor-default" hover>
      <p className="text-sm text-gray-600">{label}</p>
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-lg">Welcome back, {state.settings.name || 'User'}</p>
      </div>
      <div className="flex gap-3 mb-8">
        <Button as={Link} to="/transactions" variant="secondary">
          View All
        </Button>
        <Button as={Link} to="/add" variant="primary">
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard label="Balance" value={formatCurrency(stats.balance, settings.currency)} />
        <StatCard label="Income" value={formatCurrency(stats.income, settings.currency)} type="income" />
        <StatCard label="Expenses" value={formatCurrency(stats.expense, settings.currency)} type="expense" />
        <StatCard label="Top Category" value={stats.topCategory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
            <Link to="/transactions" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 mb-3 text-lg">No transactions yet</p>
              <Link to="/add" className="text-blue-600 hover:text-blue-700 font-medium">
                Add your first transaction
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-sm font-medium text-gray-700">Title</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">Category</th>
                    <th className="text-left py-3 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-right py-3 text-sm font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={cx(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-colors",
                            t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          )}>
                            {t.title.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{t.title}</p>
                            <p className="text-xs text-gray-500">{t.method}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm">
                        <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-700">{t.category}</span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{t.date}</td>
                      <td className={cx(
                        "py-4 text-right font-semibold",
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

        <Card className="p-6" hover>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Budget</h2>
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600">Used</span>
              <span className="font-semibold text-gray-900">{stats.budgetUsed}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={cx(
                  "h-full rounded-full transition-all duration-700",
                  stats.budgetUsed >= 90 ? "bg-red-500" : stats.budgetUsed >= 75 ? "bg-yellow-500" : "bg-blue-500"
                )}
                style={{ width: `${stats.budgetUsed}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm mb-6">
            <span className="text-gray-600">Spent: <span className="font-medium text-gray-900">{formatCurrency(stats.expense, settings.currency)}</span></span>
            <span className="text-gray-600">Budget: <span className="font-medium text-gray-900">{formatCurrency(stats.budget, settings.currency)}</span></span>
          </div>
          <div className={cx(
            "mt-4 p-4 rounded-xl text-sm font-medium",
            stats.budgetUsed >= 90 ? "bg-red-500/20 text-red-400" : stats.budgetUsed >= 75 ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"
          )}>
            {stats.budgetUsed >= 90 ? "⚠️ Near budget limit" : stats.budgetUsed >= 75 ? "⚡ Getting close to limit" : "✓ On track with budget"}
          </div>
        </Card>
      </div>
    </div >
  )
}