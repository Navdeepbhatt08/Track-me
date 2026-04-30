import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './App.css'
import App from './App.jsx'
import { ExpenseProvider } from './state/ExpenseContext.jsx'
import { AuthProvider } from './state/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ExpenseProvider>
          <App />
        </ExpenseProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
