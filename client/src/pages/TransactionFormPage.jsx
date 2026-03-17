import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { formatDateInputValue } from '../lib/utils'
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
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {isEdit ? 'Edit transaction' : 'Add transaction'}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {isEdit ? 'Update the details and save changes.' : 'Record a new expense or income.'}
          </p>
        </div>
        <Button as={Link} to="/transactions" variant="secondary">
          Back
        </Button>
      </div>

      {isEdit && !existing ? (
        <Card className="mt-6 p-5">
          <div className="text-sm text-slate-600">
            Transaction not found. Go back to{' '}
            <Link className="font-semibold text-blue-700" to="/transactions">
              Transactions
            </Link>
            .
          </div>
        </Card>
      ) : (
        <Card className="mt-6 p-5">
          <form
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
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
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Title
              </label>
              <input
                value={form.title}
                onChange={(e) => patch({ title: e.target.value })}
                placeholder="e.g. Groceries, Salary, Rent"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => patch({ type: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => patch({ category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Amount ({state.settings.currency})
              </label>
              <input
                value={form.amount}
                onChange={(e) => patch({ amount: e.target.value })}
                type="number"
                min="0"
                step="1"
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Payment method
              </label>
              <select
                value={form.method}
                onChange={(e) => patch({ method: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
              >
                {METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </label>
              <input
                value={form.date}
                onChange={(e) => patch({ date: e.target.value })}
                type="date"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Notes (optional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => patch({ notes: e.target.value })}
                rows={3}
                placeholder="Any details you want to remember..."
                className="mt-1 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
              />
            </div>

            <div className="sm:col-span-2 mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button as={Link} to="/transactions" variant="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {isEdit ? 'Save changes' : 'Add transaction'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}

