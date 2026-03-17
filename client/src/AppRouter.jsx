import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import SignupPage from './pages/SignupPage'
import TransactionFormPage from './pages/TransactionFormPage'
import TransactionsPage from './pages/TransactionsPage'

export default function AppRouter() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/add" element={<TransactionFormPage mode="add" />} />
        <Route path="/edit/:id" element={<TransactionFormPage mode="edit" />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

