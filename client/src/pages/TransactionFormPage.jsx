import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
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
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-surface-950 dark:text-white sm:text-5xl">
            {isEdit ? 'Update Record' : 'New Transaction'}
          </h1>
          <p className="text-base font-medium text-surface-500 dark:text-surface-400">
            {isEdit ? 'Modify the details of your existing record.' : 'Capture your spending or income details precisely.'}
          </p>
        </div>
        <Button as={Link} to="/transactions" variant="secondary" className="px-6">
          Back to List
        </Button>
      </div>

      {isEdit && !existing ? (
        <Card className="mt-10 p-12 text-center" variant="default">
          <div className="text-lg font-bold text-surface-500 mb-6">
            Transaction record not found.
          </div>
          <Button as={Link} to="/transactions" variant="primary">
            Return to Activity
          </Button>
        </Card>
      ) : (
        <Card className="mt-10 p-8 sm:p-10" variant="default">
          <form
            className="space-y-8"
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
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Input
                  label="Transaction Title"
                  value={form.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  placeholder="e.g. Monthly Grocery, Freelance Payment"
                  required
                  className="py-3"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
                  Transaction Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => patch({ category: e.target.value })}
                  className="block w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
                  Type of Entry
                </label>
                <div className="flex p-1 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-800">
                   <button
                     type="button"
                     onClick={() => patch({ type: 'expense' })}
                     className={cx(
                       "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                       form.type === 'expense' ? "bg-white text-surface-900 shadow-sm dark:bg-surface-800 dark:text-white" : "text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                     )}
                   >
                     EXPENSE
                   </button>
                   <button
                     type="button"
                     onClick={() => patch({ type: 'income' })}
                     className={cx(
                       "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                       form.type === 'income' ? "bg-brand-600 text-white shadow-brand-600/20" : "text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
                     )}
                   >
                     INCOME
                   </button>
                </div>
              </div>

              <Input
                label={`Amount (${state.settings.currency})`}
                value={form.amount}
                onChange={(e) => patch({ amount: e.target.value })}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
                className="py-3 font-display font-bold"
              />

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
                  Payment Method
                </label>
                <select
                  value={form.method}
                  onChange={(e) => patch({ method: e.target.value })}
                  className="block w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
                  Entry Date
                </label>
                <input
                  value={form.date}
                  onChange={(e) => patch({ date: e.target.value })}
                  type="date"
                  className="block w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
                  Additional Notes
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => patch({ notes: e.target.value })}
                  rows={4}
                  placeholder="Describe the transaction for future reference..."
                  className="block w-full resize-none rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-600 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
                />
              </div>
            </div>

            <div className="pt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end border-t border-surface-50 dark:border-surface-800/50">
              <Button as={Link} to="/transactions" variant="ghost" className="px-8">
                Discard
              </Button>
              <Button type="submit" variant="primary" className="px-12 py-3 shadow-lg shadow-brand-600/20">
                {isEdit ? 'Update Details' : 'Save Transaction'}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}

