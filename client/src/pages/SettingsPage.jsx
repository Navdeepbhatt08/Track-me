import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useExpense } from '../state/ExpenseContext'  

export default function SettingsPage() {
  const { state, updateSettings, clearTransactions } = useExpense()
  const [name, setName] = useState(state.settings.name || '')
  const [currency, setCurrency] = useState(state.settings.currency || 'INR')
  const [monthlyBudget, setMonthlyBudget] = useState(state.settings.monthlyBudget || 0)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Customize your profile and budget.
        </p>
      </div>

      <Card className="mt-6 p-5">
        <form
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            updateSettings({
              name: String(name || '').trim() || 'User',
              currency,
              monthlyBudget: Number(monthlyBudget || 0),
            })
            alert('Saved!')
          }}
        >
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Your name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Monthly budget
            </label>
            <input
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              type="number"
              min="0"
              step="1"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none ring-blue-500/20 focus:ring-4 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100"
            />
          </div>

          <div className="sm:col-span-2 mt-2 flex justify-end">
            <Button type="submit" variant="primary">
              Save settings
            </Button>
          </div>
        </form>
      </Card>

      <Card className="mt-4 p-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Danger zone</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          This will remove all transactions stored in your browser.
        </p>
        <div className="mt-4">
          <Button
            variant="danger"
            onClick={() => {
              const ok = window.confirm('Clear ALL transactions?')
              if (ok) clearTransactions()
            }}
          >
            Clear transactions
          </Button>
        </div>
      </Card>
    </div>
  )
}

