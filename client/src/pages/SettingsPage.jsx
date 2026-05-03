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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      <Card className="p-6 mb-6" hover>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
            <p className="text-sm text-gray-500">Update your personal information</p>
          </div>
        </div>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            updateSettings({
              name: String(name || '').trim() || 'User',
              currency,
              monthlyBudget: Number(monthlyBudget || 0),
            })
            alert('Settings saved!')
          }}
        >
          <Input
            label="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <Input
              label="Monthly Budget"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              type="number"
              min="0"
              placeholder="0.00"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6 border-red-500/30 bg-red-500/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
            <p className="text-sm text-gray-500">Irreversible actions</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          This will permanently delete all your transactions. This action cannot be undone.
        </p>
        <Button
          variant="outline"
          className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
          onClick={() => {
            if (window.confirm('Delete ALL transactions? This cannot be undone.')) {
              clearTransactions()
              alert('All data cleared.')
            }
          }}
        >
          Clear All Data
        </Button>
      </Card>
    </div>
  )
}

