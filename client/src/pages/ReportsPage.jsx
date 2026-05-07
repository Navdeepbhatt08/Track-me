import React, { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import { formatCurrency } from '../lib/utils'
import { useExpense } from '../state/ExpenseContext'

function monthKey(dateStr) {
  if (!dateStr) return ''
  return String(dateStr).slice(0, 7)
}

function formatMonthLabel(monthKey) {
  if (!monthKey) return 'All Time'
  const [year, month] = monthKey.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function ReportsPage() {
  const { state } = useExpense()
  const { transactions, settings } = state
  const [selectedMonth, setSelectedMonth] = useState('')

  // Get all available months
  const months = useMemo(() => {
    const set = new Set(transactions.map((t) => monthKey(t.date)).filter(Boolean))
    return Array.from(set).sort().reverse()
  }, [transactions])

  // Calculate totals for selected month
  const data = useMemo(() => {
    const items = selectedMonth
      ? transactions.filter((t) => monthKey(t.date) === selectedMonth)
      : transactions

    const income = items
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    const expense = items
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0)

    // Category breakdown
    const byCategory = items.reduce((acc, t) => {
      if (t.type !== 'expense') return acc
      const key = t.category || 'Other'
      acc[key] = (acc[key] || 0) + Number(t.amount || 0)
      return acc
    }, {})

    const categoryRows = Object.entries(byCategory)
      .map(([cat, amt]) => ({
        cat,
        amt,
        pct: Object.values(byCategory).reduce((a, b) => a + b, 0) > 0
          ? Math.round((amt / Object.values(byCategory).reduce((a, b) => a + b, 0)) * 100)
          : 0,
      }))
      .sort((a, b) => b.amt - a.amt)

    return { items, income, expense, categoryRows }
  }, [transactions, selectedMonth])

  const balance = data.income - data.expense

  const downloadReport = () => {
    const monthLabel = selectedMonth ? formatMonthLabel(selectedMonth) : 'All Time'
    const csvContent = [
      ['Expense Tracker Report'],
      ['Period:', monthLabel],
      ['Generated:', new Date().toLocaleString()],
      [],
      ['Summary'],
      ['Income:', data.income],
      ['Expenses:', data.expense],
      ['Balance:', balance],
      [],
      ['Transactions'],
      ['Date', 'Title', 'Category', 'Type', 'Amount', 'Method', 'Notes'],
      ...data.items.map(t => [
        t.date,
        t.title,
        t.category,
        t.type,
        t.amount,
        t.method || 'UPI',
        t.notes || ''
      ]),
      [],
      ['Spending by Category'],
      ['Category', 'Amount', 'Percentage'],
      ...data.categoryRows.map(r => [r.cat, r.amt, `${r.pct}%`])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `expense-report-${selectedMonth || 'all-time'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="max-w-5xl mx-auto">

      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Financial Reports</h1>
          <p className="text-slate-500 dark:text-slate-400">{formatMonthLabel(selectedMonth)}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 min-w-[240px]">
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Month</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Time</option>
              {months.map((m) => (
                <option key={m} value={m}>{formatMonthLabel(m)}</option>
              ))}
            </select>
          </div>

          <button
            onClick={downloadReport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Total Income</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(data.income, settings.currency)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(data.expense, settings.currency)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Net Balance</p>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
            {formatCurrency(balance, settings.currency)}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">Transactions</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{data.items.length}</p>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Spending by Category</h2>

        {data.categoryRows.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">No expenses found for this period.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {data.categoryRows.map((row) => (
              <div key={row.cat} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{row.cat}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(row.amt, settings.currency)}</p>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recent Transactions</h2>

        {data.items.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">No transactions found for this period.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Type</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.slice(0, 10).map((tx) => (
                  <tr key={tx._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{tx.date}</td>
                    <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">{tx.title}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{tx.category}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${tx.type === 'income'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${tx.type === 'income'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                      }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, settings.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.items.length > 10 && (
              <p className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
                Showing 10 of {data.items.length} transactions
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

