import React, { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { cx, formatCurrency } from '../lib/utils'
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

// Category Icons Mapping
const CATEGORY_ICONS = {
  Food: '🍔',
  Travel: '✈️',
  Bills: '💡',
  Shopping: '🛍️',
  Health: '💊',
  Salary: '💰',
  Other: '📦'
}

// Simple Pie Chart Component
function PieChart({ data, total }) {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6']
  const radius = 60
  const circumference = 2 * Math.PI * radius
  let currentOffset = 0

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          {/* Background circle */}
          <circle cx="70" cy="70" r={radius} fill="transparent" stroke="#E5E7EB" strokeWidth="20" />
          {/* Data segments */}
          {data.map((item, index) => {
            const percentage = (item.amt / total) * 100
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -currentOffset
            currentOffset += (percentage / 100) * circumference

            return (
              <circle
                key={item.cat}
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke={colors[index % colors.length]}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500"
              />
            )
          })}
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-500">Total</span>
          <span className="text-sm font-bold text-gray-900">{data.length}</span>
          <span className="text-xs text-gray-500">categories</span>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {data.slice(0, 4).map((item, index) => (
          <div key={item.cat} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
            <span className="text-xs text-gray-600">{CATEGORY_ICONS[item.cat] || '•'} {item.cat}</span>
          </div>
        ))}
        {data.length > 4 && (
          <span className="text-xs text-gray-400">+{data.length - 4} more</span>
        )}
      </div>
    </div>
  )
}

// Monthly Trend Bar Chart
function MonthlyBarChart({ monthlyData, months, currency }) {
  if (months.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No monthly data available</p>
      </div>
    )
  }

  const maxValue = Math.max(
    ...months.map(m => Math.max(monthlyData[m]?.income || 0, monthlyData[m]?.expense || 0)),
    1
  )

  return (
    <div className="space-y-4">
      {months.slice(0, 6).map((month) => {
        const data = monthlyData[month] || { income: 0, expense: 0 }
        const incomePercent = (data.income / maxValue) * 100
        const expensePercent = (data.expense / maxValue) * 100

        return (
          <div key={month} className="group">
            <div className="flex items-center gap-3 mb-1">
              <span className="w-16 text-xs font-medium text-gray-600">{formatMonthLabel(month).split(' ')[0]}</span>
              <div className="flex-1 space-y-1.5">
                {/* Income Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(incomePercent, 2)}%` }}
                    />
                  </div>
                  <span className="text-xs text-green-600 font-medium w-16 text-right">
                    {formatCurrency(data.income, currency)}
                  </span>
                </div>
                {/* Expense Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(expensePercent, 2)}%` }}
                    />
                  </div>
                  <span className="text-xs text-red-600 font-medium w-16 text-right">
                    {formatCurrency(data.expense, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full" />
          <span className="text-xs text-gray-600">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-500 rounded-full" />
          <span className="text-xs text-gray-600">Expenses</span>
        </div>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const { state } = useExpense()
  const { transactions, settings } = state

  const months = useMemo(() => {
    const set = new Set(transactions.map((t) => monthKey(t.date)).filter(Boolean))
    return Array.from(set).sort().reverse()
  }, [transactions])

  const [selectedMonth, setSelectedMonth] = useState(() => months[0] ?? '')

  // Calculate monthly data for the chart
  const monthlyData = useMemo(() => {
    return transactions.reduce((acc, t) => {
      const month = monthKey(t.date)
      if (!month) return acc
      if (!acc[month]) acc[month] = { income: 0, expense: 0 }
      if (t.type === 'income') {
        acc[month].income += Number(t.amount || 0)
      } else {
        acc[month].expense += Number(t.amount || 0)
      }
      return acc
    }, {})
  }, [transactions])

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

    const byCategory = items.reduce((acc, t) => {
      if (t.type !== 'expense') return acc
      const key = t.category || 'Other'
      acc[key] = (acc[key] || 0) + Number(t.amount || 0)
      return acc
    }, {})

    const total = Object.values(byCategory).reduce((a, b) => a + b, 0)
    const rows = Object.entries(byCategory)
      .map(([cat, amt]) => ({
        cat,
        amt,
        pct: total > 0 ? Math.round((amt / total) * 100) : 0,
      }))
      .sort((a, b) => b.amt - a.amt)

    // Generate insights
    const insights = []
    if (rows.length > 0) {
      const topCategory = rows[0]
      insights.push({
        icon: CATEGORY_ICONS[topCategory.cat] || '📊',
        title: `Top Spending: ${topCategory.cat}`,
        description: `You spent ${formatCurrency(topCategory.amt, settings.currency)} on ${topCategory.cat} (${topCategory.pct}% of total)`
      })
    }
    if (income > expense) {
      insights.push({
        icon: '💰',
        title: 'Great Savings!',
        description: `You saved ${formatCurrency(income - expense, settings.currency)} this period. Keep it up!`
      })
    } else if (expense > income && income > 0) {
      insights.push({
        icon: '⚠️',
        title: 'Spending Alert',
        description: `Expenses exceeded income by ${formatCurrency(expense - income, settings.currency)}. Consider reviewing your budget.`
      })
    }
    if (settings.monthlyBudget > 0 && expense > settings.monthlyBudget) {
      insights.push({
        icon: '🚨',
        title: 'Budget Exceeded',
        description: `You've spent ${formatCurrency(expense, settings.currency)}, which is ${Math.round((expense / settings.monthlyBudget) * 100)}% of your monthly budget.`
      })
    }

    return { items, income, expense, rows, total, insights }
  }, [transactions, selectedMonth, settings.currency, settings.monthlyBudget])

  const downloadReport = () => {
    const monthLabel = selectedMonth || 'All Time'
    const csvContent = [
      ['Expense Tracker Report'],
      ['Period:', monthLabel],
      ['Generated:', new Date().toLocaleString()],
      [],
      ['Summary'],
      ['Income:', data.income],
      ['Expenses:', data.expense],
      ['Balance:', data.income - data.expense],
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
      ...data.rows.map(r => [r.cat, r.amt, `${r.pct}%`])
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
    <div className="max-w-6xl mx-auto">
      {/* Header with Month Display */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600">{formatMonthLabel(selectedMonth)} Overview</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 shadow-sm"
          >
            <option value="">All Time</option>
            {months.map((m) => (
              <option key={m} value={m}>{formatMonthLabel(m)}</option>
            ))}
          </select>

          <Button
            onClick={downloadReport}
            variant="primary"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 rounded-lg px-5 py-2.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-5 cursor-default bg-gradient-to-br from-green-50 to-white border-green-100" hover>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500 shadow-lg shadow-green-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Income</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(data.income, settings.currency)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 cursor-default bg-gradient-to-br from-red-50 to-white border-red-100" hover>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-500 shadow-lg shadow-red-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(data.expense, settings.currency)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 cursor-default bg-gradient-to-br from-blue-50 to-white border-blue-100" hover>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500 shadow-lg shadow-blue-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Net Balance</p>
              <p className={cx(
                "text-2xl font-bold",
                (data.income - data.expense) >= 0 ? "text-blue-600" : "text-red-600"
              )}>
                {formatCurrency(data.income - data.expense, settings.currency)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 cursor-default bg-gradient-to-br from-purple-50 to-white border-purple-100" hover>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500 shadow-lg shadow-purple-500/30 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Transactions</p>
              <p className="text-2xl font-bold text-purple-600">
                {data.items.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      {data.insights.length > 0 && (
        <Card className="p-6 mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Insights & Recommendations
          </h2>
          <div className="space-y-3">
            {data.insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm">
                <span className="text-lg">{insight.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts & Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Category Pie Chart */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
            Category Distribution
          </h2>
          <PieChart data={data.rows} total={data.total} />
        </Card>

        {/* Monthly Trend Chart */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Monthly Trend (Last 6 Months)
          </h2>
          <MonthlyBarChart monthlyData={monthlyData} months={months} currency={settings.currency} />
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Spending by Category
        </h2>

        {data.rows.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No expense data</p>
        ) : (
          <div className="space-y-4">
            {data.rows.map((r, i) => (
              <div key={r.cat} className="group">
                <div className="flex justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CATEGORY_ICONS[r.cat] || '📦'}</span>
                    <span className={cx(
                      'w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold',
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                        i === 1 ? 'bg-gray-600 text-gray-300' :
                          i === 2 ? 'bg-orange-500/20 text-orange-400' :
                            'bg-gray-700 text-gray-400'
                    )}>
                      {i + 1}
                    </span>
                    <span className="font-medium text-gray-900">{r.cat}</span>
                  </div>
                  <span className="text-gray-600">
                    {formatCurrency(r.amt, settings.currency)} <span className="text-gray-500">({r.pct}%)</span>
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={cx(
                      'h-full rounded-full transition-all duration-700 ease-out',
                      r.pct >= 50 ? 'bg-gradient-to-r from-red-500 to-red-400' :
                        r.pct >= 25 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                          'bg-gradient-to-r from-green-500 to-green-400'
                    )}
                    style={{ width: `${Math.max(3, r.pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-gray-600">Transactions</span>
            </div>
            <span className="font-semibold text-gray-900">{data.items.length}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600">Monthly Budget</span>
            </div>
            <span className="font-semibold text-gray-900">{formatCurrency(settings.monthlyBudget, settings.currency)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-gray-600">Remaining</span>
            </div>
            <span className={cx(
              "font-bold text-lg",
              (Number(settings.monthlyBudget || 0) - data.expense) >= 0 ? "text-green-600" : "text-red-600"
            )}>
              {formatCurrency(Number(settings.monthlyBudget || 0) - data.expense, settings.currency)}
            </span>
          </div>
        </div>

        <div className={cx(
          "mt-4 p-4 rounded-lg text-sm font-medium flex items-center gap-2",
          data.expense > data.income ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
        )}>
          <span className="text-lg">{data.expense > data.income ? "⚠️" : "✓"}</span>
          {data.expense > data.income
            ? "Spending exceeds income this period"
            : "You're saving money this period"}
        </div>
      </Card>
    </div>
  )
}

