import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useExpense } from '../state/ExpenseContext'  

export default function SettingsPage() {
  const { state, updateSettings, clearTransactions } = useExpense()
  const [name, setName] = useState(state.settings.name || '')
  const [currency, setCurrency] = useState(state.settings.currency || 'INR')
  const [monthlyBudget, setMonthlyBudget] = useState(state.settings.monthlyBudget || 0)

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-surface-950 dark:text-white sm:text-5xl">
          Account Settings
        </h1>
        <p className="text-base font-medium text-surface-500 dark:text-surface-400">
          Personalize your dashboard and financial targets.
        </p>
      </div>

      <Card className="mt-10 p-8 sm:p-10" variant="default">
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault()
            updateSettings({
              name: String(name || '').trim() || 'User',
              currency,
              monthlyBudget: Number(monthlyBudget || 0),
            })
            alert('Settings updated successfully!')
          }}
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Public Display Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="py-3"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-surface-500 dark:text-surface-400 ml-1">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="block w-full rounded-2xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 transition-all focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-100 dark:focus:border-brand-400 dark:focus:ring-brand-400/10"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>

            <Input
              label="Monthly Budget Target"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              type="number"
              min="0"
              step="1"
              placeholder="0.00"
              className="py-3"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-surface-50 dark:border-surface-800/50">
             <p className="text-xs font-medium text-surface-400 max-w-[240px]">
               Changes take effect immediately across all dashboard views.
             </p>
             <Button type="submit" variant="primary" className="px-10 py-3 shadow-lg shadow-brand-600/20">
               Save Changes
             </Button>
          </div>
        </form>
      </Card>

      <div className="mt-12 space-y-4">
        <h3 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-500 ml-1">Advanced Controls</h3>
        <Card className="p-8 border-red-500/10 bg-red-500/[0.02]" variant="default">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-red-600 dark:text-red-400">Security & Data Clearing</h2>
              <p className="text-sm font-medium text-surface-500">
                Permanently delete all transaction history from local storage.
              </p>
            </div>
            <Button
              variant="outline"
              className="text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white dark:hover:bg-red-500 hover:border-red-500 px-6 whitespace-nowrap"
              onClick={() => {
                if (window.confirm('CRITICAL: This will permanently delete ALL transactions. This action cannot be undone. Proceed?')) {
                  clearTransactions()
                  alert('All transaction data has been cleared.')
                }
              }}
            >
              Clear Data History
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

