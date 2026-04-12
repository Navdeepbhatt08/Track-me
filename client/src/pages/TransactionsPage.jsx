import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
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
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
           <h1 className="text-4xl font-extrabold tracking-tight text-surface-950 dark:text-white sm:text-5xl">
            Transaction History
          </h1>
          <p className="text-base font-medium text-surface-500 dark:text-surface-400">
            Manage your spending with advanced search and filters.
          </p>
        </div>
        <Button as={Link} to="/add" variant="primary" className="px-8 shadow-xl shadow-brand-600/20">
          Add New
        </Button>
      </div>

      <Card className="mt-10 p-6 border-white/10" variant="glass">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              label="Search Records"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by title, category, or payment method..."
              className="py-2.5"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
              Transaction Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="block w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
            >
              <option value="all">All Types</option>
              <option value="expense">Expenses Only</option>
              <option value="income">Income Only</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <Card className="mt-8 overflow-visible" variant="default">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-100 text-left dark:border-surface-800">
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-surface-400">Description</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-surface-400">Category</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-surface-400">Type</th>
                <th className="px-8 py-5 text-[11px] font-bold uppercase tracking-widest text-surface-400">Date</th>
                <th className="px-8 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-surface-400">Amount</th>
                <th className="px-8 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-surface-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-800/50">
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-8 py-12 text-center text-sm font-medium text-surface-400" colSpan={6}>
                    No records matching your search queries.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="group transition-colors hover:bg-surface-50/50 dark:hover:bg-surface-800/10">
                    <td className="px-8 py-5">
                      <div className="font-bold text-surface-900 group-hover:text-brand-600 transition-colors dark:text-surface-100 dark:group-hover:text-brand-400">
                        {t.title}
                      </div>
                      <div className="text-xs font-medium text-surface-400">{t.method}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center rounded-lg bg-surface-100/80 px-2 py-1 text-[10px] font-bold text-surface-600 dark:bg-surface-800 dark:text-surface-400">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={cx(
                          'inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold tracking-tight ring-1 ring-inset',
                          t.type === 'income'
                            ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20'
                            : 'bg-surface-50 text-surface-600 ring-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:ring-surface-700',
                        )}
                      >
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-surface-500 dark:text-surface-400">{t.date}</td>
                    <td
                      className={cx(
                        'px-8 py-5 text-right font-display text-base font-bold tabular-nums',
                        t.type === 'income' ? 'text-emerald-600' : 'text-surface-900 dark:text-white',
                      )}
                    >
                      {t.type === 'expense' ? '-' : '+'}
                      {formatCurrency(t.amount, settings.currency)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          as={Link}
                          to={`/edit/${t.id}`}
                          variant="secondary"
                          size="sm"
                          className="rounded-lg px-3 py-1.5"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost"
                          size="sm"
                          className="rounded-lg px-3 py-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950/20"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this transaction?')) deleteTransaction(t.id)
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

