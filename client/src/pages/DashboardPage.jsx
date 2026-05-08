import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatCurrency, cx } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

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

    const monthlySavingsGoal = Number(settings.monthlySavingsGoal || 0) || (budget * 0.2)
    const currentSavings = Math.max(0, income - expense)
    const savingsProgress = monthlySavingsGoal > 0 ? Math.min(100, Math.round((currentSavings / monthlySavingsGoal) * 100)) : 0

    const monthlyData = transactions.reduce((acc, t) => {
      const month = String(t.date).slice(0, 7)
      if (!month) return acc
      if (!acc[month]) acc[month] = { income: 0, expense: 0 }
      if (t.type === 'income') {
        acc[month].income += Number(t.amount || 0)
      } else {
        acc[month].expense += Number(t.amount || 0)
      }
      return acc
    }, {})

    const sortedMonths = Object.keys(monthlyData).sort().reverse()
    const currentMonth = sortedMonths[0]
    const prevMonth = sortedMonths[1]
    const currentExpense = currentMonth ? monthlyData[currentMonth].expense : 0
    const prevExpense = prevMonth ? monthlyData[prevMonth].expense : currentExpense
    const expenseTrend = prevExpense > 0 ? Math.round(((currentExpense - prevExpense) / prevExpense) * 100) : 0

    return { income, expense, balance, topCategory, budget, budgetUsed, expenseTrend, monthlySavingsGoal, currentSavings, savingsProgress }
  }, [transactions, settings.monthlyBudget, settings.monthlySavingsGoal])

  const recent = useMemo(() => {
    return transactions
      .slice()
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
      .slice(0, 5)
  }, [transactions])

  return (
    <div className="max-w-7xl mx-auto">

      <Card className="mb-8 bg-gradient-to-r backdrop-blur-sm from-blue-900 to-blue-700  text-white p-6 shadow-xl shadow-blue-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {state.settings.name || 'User '} !👋</h1>
              <p className="text-blue-100 mt-1">
                You have {stats.balance >= 0 ? 'saved' : 'spent'} {formatCurrency(Math.abs(stats.balance), settings.currency)} this month
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-blue-200 uppercase tracking-wide font-medium">Total Balance</p>
              <p className="text-3xl font-bold">{formatCurrency(stats.balance, settings.currency)}</p>
            </div>
          </div>
        </div>
      </Card>
      <div className="flex gap-3 mb-8">
        <Button as={Link} to="/transactions" variant="secondary">
          View All
        </Button>
        <Button as={Link} to="/add" variant="primary">
          Add Transaction
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="p-6 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-default">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-600 shadow-lg shadow-gray-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Balance</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{formatCurrency(stats.balance, settings.currency)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all cursor-default">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 shadow-lg shadow-green-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.income, settings.currency)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-rose-50/50 to-white dark:from-rose-950/20 dark:to-slate-900 hover:shadow-2xl hover:shadow-rose-500/5 transition-all cursor-default">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500 shadow-lg shadow-red-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.expense, settings.currency)}</p>
              {stats.expenseTrend !== 0 && (
                <p className={cx(
                  "text-xs mt-1 font-medium",
                  stats.expenseTrend > 0 ? 'text-red-600' : 'text-green-600'
                )}>
                  {stats.expenseTrend > 0 ? '↑' : '↓'} {Math.abs(stats.expenseTrend)}% vs last month
                </p>
              )}
            </div>
          </div>
        </Card>


      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h2>
            <Link to="/transactions" className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-sm font-semibold rounded-xl transition-all">
              View All
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
                  <tr className="border-b border-slate-100 dark:border-slate-800/50">
                    <th className="text-left py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Title</th>
                    <th className="text-left py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Category</th>
                    <th className="text-left py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="text-right py-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => (
                    <tr key={t._id} className="border-b border-slate-50 dark:border-slate-800/30 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={cx(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-colors",
                            t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          )}>
                            {t.title.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{t.title}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t.method}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 text-sm">
                        <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800/50 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">{t.category}</span>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{t.date}</td>
                      <td className={cx(
                        "py-4 text-right font-semibold",
                        t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
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

        <Card className="p-8 bg-gradient-to-br from-indigo-50/30 to-white dark:from-indigo-950/20 dark:to-slate-900 border-indigo-100 dark:border-indigo-500/10" hover>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500 shadow-lg shadow-purple-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Budget</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Monthly spending limit</p>
            </div>
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
            <span className="text-gray-600 dark:text-gray-400">Spent: <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(stats.expense, settings.currency)}</span></span>
            <span className="text-gray-600 dark:text-gray-400">Budget: <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(stats.budget, settings.currency)}</span></span>
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