import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import { cx, formatCurrency } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Salary', 'Other']

function monthKey(dateStr) {
  if (!dateStr) return ''
  return String(dateStr).slice(0, 7)
}

function formatMonthLabel(monthKey) {
  if (!monthKey) return ''
  const [year, month] = monthKey.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function TransactionsPage() {
  const { state, deleteTransaction } = useExpense()
  const { transactions, settings } = state

  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('')

  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map(t => monthKey(t.date)).filter(Boolean))
    return Array.from(months).sort().reverse()
  }, [transactions])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return transactions
      .filter((t) => (type === 'all' ? true : t.type === type))
      .filter((t) => (category === 'all' ? true : t.category === category))
      .filter((t) => (selectedMonth ? monthKey(t.date) === selectedMonth : true))
      .filter((t) =>
        q
          ? String(t.title).toLowerCase().includes(q) ||
          String(t.category).toLowerCase().includes(q) ||
          String(t.method).toLowerCase().includes(q)
          : true,
      )
      .slice()
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
  }, [transactions, query, type, category, selectedMonth])


  const groupedByMonth = useMemo(() => {
    const groups = {}
    filtered.forEach(t => {
      const month = monthKey(t.date)
      if (!groups[month]) groups[month] = []
      groups[month].push(t)
    })
    return groups
  }, [filtered])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage and monitor your financial records</p>
        </div>
        <Button as={Link} to="/add" variant="primary">
          Add New
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
          >
            <option value="">All Months</option>
            {availableMonths.map((m) => (
              <option key={m} value={m}>{formatMonthLabel(m)}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Title</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Category</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Type</th>
                <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Date</th>
                <th className="px-4 py-4 text-right text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Amount</th>
                <th className="px-4 py-4 text-right text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    No transactions found
                  </td>
                </tr>
              ) : (
                Object.entries(groupedByMonth).map(([month, monthTransactions]) => (
                  <React.Fragment key={month}>
                    {/* Month Header */}
                    <tr className="bg-slate-50/30 dark:bg-slate-800/20">
                      <td colSpan={6} className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/30">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 dark:text-slate-300 tracking-tight">{formatMonthLabel(month)}</span>
                          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {monthTransactions.length} transaction{monthTransactions.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </td>
                    </tr>
                    {/* Month Transactions */}
                    {monthTransactions.map((t) => (
                      <tr key={t._id} className="border-b border-slate-50 dark:border-slate-800/30 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={cx(
                              'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors',
                              t.type === 'income'
                                ? 'bg-green-100 text-green-600 group-hover:bg-green-200'
                                : 'bg-red-100 text-red-600 group-hover:bg-red-200'
                            )}>
                              {t.title.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{t.title}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t.method}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800/50 rounded-md text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                            {t.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cx(
                            'px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border',
                            t.type === 'income'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                          )}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{t.date}</td>
                        <td className={cx(
                          'px-4 py-3 text-right font-bold',
                          t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                        )}>
                          {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount, settings.currency)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-3 group-hover:opacity-100 transition-opacity">
                            <Link
                              to={`/edit/${t._id}`}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Edit
                            </Link>
                            <button
                              className="text-sm text-red-600 hover:text-red-700 font-medium"
                              onClick={() => {
                                if (window.confirm('Delete this transaction?')) deleteTransaction(t._id)
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

