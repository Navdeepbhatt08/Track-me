import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { transactionsAPI, settingsAPI } from '../lib/api'
import { formatDateInputValue, uid } from '../lib/utils'
import { useAuth } from './AuthContext'

const ExpenseContext = createContext(null)

const initialState = {
  settings: {
    currency: 'INR',
    monthlyBudget: 50000,
    name: 'User',
  },
  transactions: [],
  loading: false,
  error: null
}

function reducer(state, action) {
  switch (action.type) {
    case 'set_loading': {
      return { ...state, loading: action.payload }
    }
    case 'set_error': {
      return { ...state, error: action.payload, loading: false }
    }
    case 'set_transactions': {
      return { ...state, transactions: action.payload, loading: false, error: null }
    }
    case 'set_settings': {
      return { ...state, settings: action.payload, loading: false, error: null }
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
        t._id === action.id ? { ...t, ...action.patch } : t,
      )
      return { ...state, transactions: next }
    }
    case 'tx.delete': {
      return {
        ...state,
        transactions: state.transactions.filter((t) => t._id !== action.id),
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
  const [isInitialized, setIsInitialized] = useState(false)
  const { isAuthed } = useAuth()

  // Initialize data from API only when authenticated
  useEffect(() => {
    if (!isAuthed) {
      setIsInitialized(true)
      return
    }

    const initializeData = async () => {
      try {
        dispatch({ type: 'set_loading', payload: true })

        // Load settings
        const settingsResponse = await settingsAPI.get()
        dispatch({ type: 'set_settings', payload: settingsResponse.settings })

        // Load transactions
        const transactionsResponse = await transactionsAPI.getAll()
        dispatch({ type: 'set_transactions', payload: transactionsResponse.items })

        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize data:', error)
        dispatch({ type: 'set_error', payload: error.message })
        setIsInitialized(true)
      }
    }

    initializeData()
  }, [isAuthed])

  const api = useMemo(() => {
    async function addTransaction(input) {
      try {
        dispatch({ type: 'set_loading', payload: true })

        const txData = {
          title: String(input.title || '').trim() || 'Untitled',
          category: String(input.category || 'Other'),
          type: input.type === 'income' ? 'income' : 'expense',
          amount: Math.abs(Number(input.amount || 0)),
          method: String(input.method || 'UPI'),
          date: String(input.date || formatDateInputValue(new Date())),
          notes: String(input.notes || ''),
        }

        const response = await transactionsAPI.create(txData)
        dispatch({ type: 'tx.add', tx: response.item })
        return response.item
      } catch (error) {
        dispatch({ type: 'set_error', payload: error.message })
        throw error
      }
    }

    async function updateTransaction(id, patch) {
      try {
        dispatch({ type: 'set_loading', payload: true })

        const response = await transactionsAPI.update(id, patch)
        dispatch({ type: 'tx.update', id, patch: response.item })
        return response.item
      } catch (error) {
        dispatch({ type: 'set_error', payload: error.message })
        throw error
      }
    }

    async function deleteTransaction(id) {
      try {
        dispatch({ type: 'set_loading', payload: true })

        await transactionsAPI.delete(id)
        dispatch({ type: 'tx.delete', id })
      } catch (error) {
        dispatch({ type: 'set_error', payload: error.message })
        throw error
      }
    }

    async function updateSettings(patch) {
      try {
        dispatch({ type: 'set_loading', payload: true })

        const response = await settingsAPI.update(patch)
        dispatch({ type: 'set_settings', payload: response.settings })
        return response.settings
      } catch (error) {
        dispatch({ type: 'set_error', payload: error.message })
        throw error
      }
    }

    async function clearTransactions() {
      try {
        dispatch({ type: 'set_loading', payload: true })

        await settingsAPI.clearAllData()
        dispatch({ type: 'tx.clear' })

        // Reload settings after clearing
        const settingsResponse = await settingsAPI.get()
        dispatch({ type: 'set_settings', payload: settingsResponse.settings })
      } catch (error) {
        dispatch({ type: 'set_error', payload: error.message })
        throw error
      }
    }

    function clearError() {
      dispatch({ type: 'set_error', payload: null })
    }

    return {
      state,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      updateSettings,
      clearTransactions,
      clearError,
      isInitialized
    }
  }, [state, isInitialized])

  return <ExpenseContext.Provider value={api}>{children}</ExpenseContext.Provider>
}

export function useExpense() {
  const ctx = useContext(ExpenseContext)
  if (!ctx) throw new Error('useExpense must be used within ExpenseProvider')
  return ctx
}

