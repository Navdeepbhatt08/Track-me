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
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">Manage your records</p>
        </div>
        <Button as={Link} to="/add" variant="primary">
          Add New
        </Button>
      </div>

      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
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
                filtered.map((t) => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium">{t.title}</p>
                      <p className="text-xs text-gray-500">{t.method}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{t.category}</td>
                    <td className="px-4 py-3">
                      <span className={cx(
                        'px-2 py-1 text-xs font-medium rounded',
                        t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      )}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.date}</td>
                    <td className={cx(
                      'px-4 py-3 text-right font-medium',
                      t.type === 'income' ? 'text-green-600' : 'text-gray-900'
                    )}>
                      {t.type === 'expense' ? '-' : '+'}{formatCurrency(t.amount, settings.currency)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/edit/${t.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </Link>
                        <button
                          className="text-sm text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (window.confirm('Delete this transaction?')) deleteTransaction(t.id)
                          }}
                        >
                          Delete
                        </button>
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

