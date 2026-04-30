import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatCurrency, cx } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

function StatCard({ label, value, badge, trend, icon: Icon }) {
  return (
    <Card className="p-6 transition-all hover:shadow-premium-hover group" variant="glass">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400">
              {label}
            </span>
            {badge}
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl font-extrabold tracking-tight text-surface-950 dark:text-white">
              {value}
            </span>
            {trend && (
              <span className={cx(
                "mt-2 text-xs font-bold",
                trend > 0 ? "text-emerald-500" : "text-red-500"
              )}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
              </span>
            )}
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-premium group-hover:scale-110 transition-transform dark:bg-surface-800">
           {Icon ? <Icon className="w-6 h-6 text-brand-600" /> : <div className="w-2 h-2 rounded-full bg-brand-500" /> }
        </div>
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
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-600/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-600 dark:bg-brand-400/10 dark:text-brand-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-500"></span>
            </span>
            Live Account Status
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-surface-950 dark:text-white sm:text-5xl">
            Financial Dashboard
          </h1>
          <p className="text-base font-medium text-surface-500 dark:text-surface-400">
            Welcome back, <span className="text-surface-900 dark:text-surface-100 font-bold">{settings.name}</span>. Here's your summary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button as={Link} to="/transactions" variant="secondary" className="px-6">
            View History
          </Button>
          <Button as={Link} to="/add" variant="primary" className="px-8 shadow-xl shadow-brand-600/20">
            Add Transaction
          </Button>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Balance"
          value={formatCurrency(stats.balance, settings.currency)}
          badge={
            <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20">
              SAFE
            </span>
          }
        />
        <StatCard
          label="Monthly Income"
          value={formatCurrency(stats.income, settings.currency)}
          trend={12}
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(stats.expense, settings.currency)}
          trend={-4}
        />
        <StatCard
          label="Top Category"
          value={stats.topCategory}
          badge={
            <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700 ring-1 ring-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:ring-brand-500/20">
              ACTIVE
            </span>
          }
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 overflow-visible" variant="default">
          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-surface-950 dark:text-white">
                  Recent Activity
                </h2>
                <p className="mt-1 text-sm font-medium text-surface-500 dark:text-surface-400">
                  Your latest transactions across all categories.
                </p>
              </div>
              <Link
                to="/transactions"
                className="group flex items-center gap-1.5 text-sm font-bold text-brand-600 dark:text-brand-400"
              >
                View all
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-surface-100 text-left dark:border-surface-800">
                    <th className="pb-4 text-[11px] font-bold uppercase tracking-widest text-surface-400">Transaction</th>
                    <th className="pb-4 px-4 text-[11px] font-bold uppercase tracking-widest text-surface-400">Category</th>
                    <th className="pb-4 px-4 text-[11px] font-bold uppercase tracking-widest text-surface-400">Date</th>
                    <th className="pb-4 text-right text-[11px] font-bold uppercase tracking-widest text-surface-400">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-50 dark:divide-surface-800/50">
                  {recent.length === 0 ? (
                    <tr>
                      <td className="py-12 text-center text-sm font-medium text-surface-400" colSpan={4}>
                        No transactions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recent.map((t) => (
                      <tr key={t.id} className="group transition-colors hover:bg-surface-50/50 dark:hover:bg-surface-800/20">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <div className={cx(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold",
                              t.type === 'income' 
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                            )}>
                              {t.title.charAt(0).toUpperCase()}
                            </div>
                            <div>
                               <div className="font-bold text-surface-900 group-hover:text-brand-600 transition-colors dark:text-surface-100 dark:group-hover:text-brand-400">
                                 {t.title}
                               </div>
                               <div className="text-xs font-medium text-surface-400">{t.method}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center rounded-lg bg-surface-100/80 px-2 py-1 text-[10px] font-bold text-surface-600 dark:bg-surface-800 dark:text-surface-400">
                            {t.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-surface-500 dark:text-surface-400">
                          {t.date}
                        </td>
                        <td className={cx(
                          "py-4 text-right font-display text-base font-bold tabular-nums",
                          t.type === 'income' ? 'text-emerald-600' : 'text-surface-900 dark:text-white'
                        )}>
                          {t.type === 'income' ? '+' : '-'}
                          {formatCurrency(t.amount, settings.currency)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-8">
          <Card className="p-8" variant="glass">
            <h2 className="text-lg font-extrabold tracking-tight text-surface-950 dark:text-white">Monthly Goal</h2>
            <p className="mt-1 text-sm font-medium text-surface-500 dark:text-surface-400">
              Spending vs Budget
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-end justify-between">
                 <div className="flex flex-col">
                   <span className="text-3xl font-extrabold tracking-tighter text-surface-950 dark:text-white">
                      {stats.budgetUsed}%
                   </span>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-surface-400">Usage Rate</span>
                 </div>
                 <div className="text-right">
                    <span className="text-sm font-bold text-surface-900 dark:text-white">
                      {formatCurrency(stats.expense, settings.currency)}
                    </span>
                    <span className="text-xs font-medium text-surface-400 block">
                      of {formatCurrency(stats.budget, settings.currency)}
                    </span>
                 </div>
              </div>

              <div className="relative h-4 w-full overflow-hidden rounded-full bg-surface-200 dark:bg-surface-800">
                <div
                  className={cx(
                    "h-full rounded-full transition-all duration-1000",
                    stats.budgetUsed >= 90 ? "bg-red-500" : "bg-brand-600"
                  )}
                  style={{ width: `${stats.budgetUsed}%` }}
                />
              </div>
              
              <div className="rounded-2xl bg-brand-600/5 p-4 border border-brand-600/10">
                 <p className="text-xs font-medium text-brand-700 dark:text-brand-300">
                   {stats.budgetUsed >= 90 
                    ? "Warning: You're close to your budget limit." 
                    : "Tip: You're on track to save this month!"}
                 </p>
              </div>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}