import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { cx, formatCurrency } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Salary', 'Other']

export default function TransactionsPage() {
  const { state, deleteTransaction } = useExpense()
  const { transactions, settings } = state

  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return transactions
      .filter((t) => (type === 'all' ? true : t.type === type))
      .filter((t) => (category === 'all' ? true : t.category === category))
      .filter((t) =>
        q
          ? String(t.title).toLowerCase().includes(q) ||
          String(t.category).toLowerCase().includes(q) ||
          String(t.method).toLowerCase().includes(q)
          : true,
      )
      .slice()
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
  }, [transactions, query, type, category])

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Transactions
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Search, filter, edit, and delete your transactions.
          </p>
        </div>
        <Button as={Link} to="/add" variant="primary">
          Add Transaction
        </Button>
      </div>

      <Card className="mt-6 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Title, category, method..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
            >
              <option value="all">All</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
            >
              <option value="all">All</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c} 
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-5 py-6 text-sm text-slate-600" colSpan={6}>
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="border-t border-slate-100 text-sm dark:border-white/10">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{t.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{t.method}</div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-200">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={cx(
                          'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
                          t.type === 'income'
                            ? 'bg-emerald-50 text-emerald-800 ring-emerald-100'
                            : 'bg-rose-50 text-rose-800 ring-rose-100',
                        )}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{t.date}</td>
                    <td
                      className={cx(
                        'px-5 py-3 text-right font-semibold tabular-nums',
                        t.type === 'income' ? 'text-emerald-700' : 'text-rose-700',
                      )}
                    >
                      {t.type === 'expense' ? '-' : '+'}
                      {formatCurrency(t.amount, settings.currency)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          as={Link}
                          to={`/edit/${t.id}`}
                          variant="secondary"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger"
                          size="sm"
                          onClick={() => {
                            const ok = window.confirm('Delete this transaction?')
                            if (ok) deleteTransaction(t.id)
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

