import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { cx, formatDateInputValue } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Salary', 'Other']
const METHODS = ['UPI', 'Cash', 'Card', 'Bank']

export default function TransactionFormPage({ mode = 'add' }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, addTransaction, updateTransaction } = useExpense()

  const existing = useMemo(() => {
    if (mode !== 'edit') return null
    return state.transactions.find((t) => t.id === id) ?? null
  }, [mode, state.transactions, id])

  const [form, setForm] = useState(() => {
    if (existing) return { ...existing }
    return {
      title: '',
      category: 'Food',
      type: 'expense',
      amount: '',
      method: 'UPI',
      date: formatDateInputValue(new Date()),
      notes: '',
    }
  })

  function patch(next) {
    setForm((f) => ({ ...f, ...next }))
  }

  const isEdit = mode === 'edit'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cx(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            form.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
          )}>
            <svg className={cx("w-6 h-6", form.type === 'income' ? 'text-green-400' : 'text-red-400')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {form.type === 'income' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              )}
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? 'Edit Transaction' : 'Add Transaction'}
            </h1>
            <p className="text-gray-600">
              {id ? 'Update your transaction details' : 'Record a new transaction'}
            </p>
          </div>
        </div>
        <Link to="/transactions" className="text-blue-400 hover:text-blue-300 font-medium">
          Back
        </Link>
      </div>

      {isEdit && !existing ? (
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-400 mb-4">Transaction not found</p>
          <Link to="/transactions" className="text-blue-400 hover:text-blue-300 font-medium">
            Go back
          </Link>
        </Card>
      ) : (
        <Card className="p-6 shadow-xl">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (isEdit) {
                updateTransaction(existing.id, {
                  title: form.title,
                  category: form.category,
                  type: form.type,
                  amount: Number(form.amount || 0),
                  method: form.method,
                  date: form.date,
                  notes: form.notes,
                })
              } else {
                addTransaction(form)
              }
              navigate('/transactions')
            }}
          >
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="e.g. Grocery shopping"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => patch({ category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="flex rounded-lg border border-gray-300 p-1 bg-white">
                  <button
                    type="button"
                    onClick={() => patch({ type: 'expense' })}
                    className={cx(
                      "flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200",
                      form.type === 'expense'
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => patch({ type: 'income' })}
                    className={cx(
                      "flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200",
                      form.type === 'income'
                        ? "bg-green-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Income
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={`Amount (${state.settings.currency})`}
                value={form.amount}
                onChange={(e) => patch({ amount: e.target.value })}
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
              />

              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => patch({ date: e.target.value })}
                required
              />
            </div>

            <Input
              label="Payment Method"
              value={form.method}
              onChange={(e) => patch({ method: e.target.value })}
              placeholder="e.g. Cash, Card, UPI"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={form.notes}
                onChange={(e) => patch({ notes: e.target.value })}
                placeholder="Add notes about this transaction..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all placeholder:text-gray-500 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="flex-1"
              >
                {id ? 'Update' : 'Save'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
