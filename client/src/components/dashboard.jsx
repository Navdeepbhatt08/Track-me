import React, { useMemo } from 'react'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function cx(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard({ userName = 'Navdeep', transactions }) {
  const items = useMemo(() => {
    if (Array.isArray(transactions) && transactions.length) return transactions

    return [
      {
        id: 't1',
        title: 'Groceries',
        category: 'Food',
        date: '2026-03-12',
        amount: -820,
        method: 'UPI',
      },
      {
        id: 't2',
        title: 'Bus Pass',
        category: 'Travel',
        date: '2026-03-10',
        amount: -450,
        method: 'Cash',
      },
      {
        id: 't3',
        title: 'Freelance',
        category: 'Income',
        date: '2026-03-08',
        amount: 4500,
        method: 'Bank',
      },
      {
        id: 't4',
        title: 'Coffee',
        category: 'Food',
        date: '2026-03-07',
        amount: -120,
        method: 'Card',
      },
      {
        id: 't5',
        title: 'Internet',
        category: 'Bills',
        date: '2026-03-05',
        amount: -799,
        method: 'UPI',
      },
    ]
  }, [transactions])

  const stats = useMemo(() => {
    const income = items
      .filter((t) => Number(t.amount) > 0)
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)
    const expense = items
      .filter((t) => Number(t.amount) < 0)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount || 0)), 0)
    const balance = income - expense

    const byCategory = items.reduce((acc, t) => {
      const amt = Number(t.amount || 0)
      if (amt >= 0) return acc
      const key = t.category || 'Other'
      acc[key] = (acc[key] || 0) + Math.abs(amt)
      return acc
    }, {})

    const topCategory =
      Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'

    return { income, expense, balance, topCategory }
  }, [items])

  const recent = items
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, 6)

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">
              Welcome back, <span className="text-slate-900">{userName}</span>
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Quick snapshot of your spending and income.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/add"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              Add Expense
            </a>
            <a
              href="/reports"
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              View Reports
            </a>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Balance"
            value={formatCurrency(stats.balance)}
            tone={stats.balance >= 0 ? 'good' : 'bad'}
          />
          <StatCard
            label="Income"
            value={formatCurrency(stats.income)}
            tone="good"
          />
          <StatCard
            label="Expenses"
            value={formatCurrency(stats.expense)}
            tone="bad"
          />
          <StatCard label="Top category" value={stats.topCategory} tone="neutral" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between gap-3 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Recent transactions
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-600">
                    Latest activity across categories.
                  </p>
                </div>
                <a
                  href="/transactions"
                  className="text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  See all
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3">Title</th>
                      <th className="px-5 py-3">Category</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((t) => {
                      const amt = Number(t.amount || 0)
                      const positive = amt >= 0
                      return (
                        <tr
                          key={t.id}
                          className="border-t border-slate-100 text-sm"
                        >
                          <td className="px-5 py-3">
                            <div className="font-semibold text-slate-900">
                              {t.title}
                            </div>
                            <div className="text-xs text-slate-500">
                              {t.method}
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {t.category}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-slate-600">{t.date}</td>
                          <td
                            className={cx(
                              'px-5 py-3 text-right font-semibold tabular-nums',
                              positive ? 'text-emerald-700' : 'text-rose-700',
                            )}
                          >
                            {positive ? '+' : '-'}
                            {formatCurrency(Math.abs(amt))}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
            <div className="px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Quick insights
              </h2>
              <p className="mt-0.5 text-sm text-slate-600">
                Small hints to keep you on track.
              </p>
            </div>

            <div className="space-y-3 px-5 pb-5">
              <Insight
                title="Set a weekly budget"
                desc="Add a spending limit and track progress each week."
                href="/settings"
              />
              <Insight
                title="Tag your expenses"
                desc="Better categories make your reports clearer."
                href="/add"
              />
              <Insight
                title="Review top category"
                desc={`Your top spend category is ${stats.topCategory}.`}
                href="/reports"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, tone = 'neutral' }) {
  const tones = {
    good: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
    bad: 'bg-rose-50 text-rose-800 ring-rose-100',
    neutral: 'bg-slate-50 text-slate-800 ring-slate-100',
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-600">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={cx(
            'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
            tones[tone] ?? tones.neutral,
          )}
        >
          {tone === 'good' ? 'Good' : tone === 'bad' ? 'High' : 'Info'}
        </span>
      </div>
    </div>
  )
}

function Insight({ title, desc, href }) {
  return (
    <a
      href={href}
      className="block rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 transition hover:bg-slate-100 "
    >
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
      <div className="mt-3 text-sm font-semibold text-blue-700">Open →</div>
    </a>
  )
}
