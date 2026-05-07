const API_BASE = 'http://localhost:8000/api'


async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

export const authAPI = {
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  },

  signup: async (name, email, password, phone, agreeTerms) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, phone, agreeTerms })
    })
  },

  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST'
    })
  },

  me: async () => {
    return apiRequest('/auth/me')
  }
}

// Transactions API
export const transactionsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString()
    return apiRequest(`/transactions?${params}`)
  },

  getById: async (id) => {
    return apiRequest(`/transactions/${id}`)
  },

  create: async (transaction) => {
    return apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction)
    })
  },

  update: async (id, transaction) => {
    return apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction)
    })
  },

  delete: async (id) => {
    return apiRequest(`/transactions/${id}`, {
      method: 'DELETE'
    })
  },

  getSummary: async (month) => {
    const params = month ? `?month=${month}` : ''
    return apiRequest(`/transactions/summary${params}`)
  }
}

// Settings API
export const settingsAPI = {
  get: async () => {
    return apiRequest('/settings')
  },

  update: async (settings) => {
    return apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    })
  },

  clearAllData: async () => {
    return apiRequest('/settings/clear-all', {
      method: 'DELETE'
    })
  }
}

// Check if user is authenticated 
export const isAuthenticated = async () => {
  try {
    await authAPI.me()
    return true
  } catch {
    return false
  }
}
