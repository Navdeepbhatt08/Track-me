import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { loadState, saveState } from '../lib/storage'
import { formatDateInputValue, uid } from '../lib/utils'

const ExpenseContext = createContext(null)

function seedTransactions() {
  return [
    {
      id: uid(),
      title: 'Groceries',
      category: 'Food',
      type: 'expense',
      amount: 820,
      method: 'UPI',
      date: '2026-03-12',
      notes: '',
    },
    {
      id: uid(),
      title: 'Bus Pass',
      category: 'Travel',
      type: 'expense',
      amount: 450,
      method: 'Cash',
      date: '2026-03-10',
      notes: '',
    },
    {
      id: uid(),
      title: 'Freelance',
      category: 'Salary',
      type: 'income',
      amount: 4500,
      method: 'Bank',
      date: '2026-03-08',
      notes: '',
    },
    {
      id: uid(),
      title: 'Internet',
      category: 'Bills',
      type: 'expense',
      amount: 799,
      method: 'UPI',
      date: '2026-03-05',
      notes: '',
    },
  ]
}

const initialState = {
  settings: {
    currency: 'INR',
    monthlyBudget: 12000,
    name: 'Navdeep',
  },
  transactions: seedTransactions(),
}

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate': {
      return action.payload ?? state
    }
    case 'settings.update': {
      return {
        ...state,
        settings: { ...state.settings, ...action.patch },
      }
    }
    case 'tx.add': {
      return {
        ...state,
        transactions: [action.tx, ...state.transactions],
      }
    }
    case 'tx.update': {
      const next = state.transactions.map((t) =>
        t.id === action.id ? { ...t, ...action.patch } : t,
      )
      return { ...state, transactions: next }
    }
    case 'tx.delete': {
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.id),
      }
    }
    case 'tx.clear': {
      return { ...state, transactions: [] }
    }
    default:
      return state
  }
}

export function ExpenseProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const persisted = loadState()
    if (persisted) dispatch({ type: 'hydrate', payload: persisted })
  }, [])

  useEffect(() => {
    saveState(state)
  }, [state])

  const api = useMemo(() => {
    function addTransaction(input) {
      const tx = {
        id: uid(),
        title: String(input.title || '').trim() || 'Untitled',
        category: String(input.category || 'Other'),
        type: input.type === 'income' ? 'income' : 'expense',
        amount: Math.abs(Number(input.amount || 0)),
        method: String(input.method || 'UPI'),
        date: String(input.date || formatDateInputValue(new Date())),
        notes: String(input.notes || ''),
      }
      dispatch({ type: 'tx.add', tx })
      return tx
    }

    function updateTransaction(id, patch) {
      dispatch({ type: 'tx.update', id, patch })
    }

    function deleteTransaction(id) {
      dispatch({ type: 'tx.delete', id })
    }

    function updateSettings(patch) {
      dispatch({ type: 'settings.update', patch })
    }

    function clearTransactions() {
      dispatch({ type: 'tx.clear' })
    }

    return {
      state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      updateSettings,
      clearTransactions,
    }
  }, [state])

  return <ExpenseContext.Provider value={api}>{children}</ExpenseContext.Provider>
}

export function useExpense() {
  const ctx = useContext(ExpenseContext)
  if (!ctx) throw new Error('useExpense must be used within ExpenseProvider')
  return ctx
}

