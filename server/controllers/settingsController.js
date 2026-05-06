const UserSettings = require('../models/UserSettings')

function httpError(statusCode, message) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

exports.getSettings = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  let settings = await UserSettings.findOne({ userId: req.user.id })
  
  if (!settings) {
    // Create default settings for new user
    settings = await UserSettings.create({
      userId: req.user.id,
      name: req.user.name || 'User'
    })
  }
  
  res.json({ settings })
}

exports.updateSettings = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  const { name, currency, monthlyBudget, notifications, theme, dateFormat } = req.body
  
  const updateData = {}
  if (name !== undefined) updateData.name = String(name).trim()
  if (currency !== undefined) updateData.currency = currency
  if (monthlyBudget !== undefined) updateData.monthlyBudget = Number(monthlyBudget)
  if (notifications !== undefined) updateData.notifications = notifications
  if (theme !== undefined) updateData.theme = theme
  if (dateFormat !== undefined) updateData.dateFormat = dateFormat
  
  let settings = await UserSettings.findOneAndUpdate(
    { userId: req.user.id },
    updateData,
    { 
      new: true, 
      upsert: true,
      runValidators: true 
    }
  )
  
  res.json({ settings })
}

exports.clearAllData = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Authentication required' })
  }

  const Transaction = require('../models/Transaction')
  
  // Delete all transactions for this user
  await Transaction.deleteMany({ userId: req.user.id })
  
  // Reset settings to defaults
  await UserSettings.findOneAndUpdate(
    { userId: req.user.id },
    {
      name: 'User',
      currency: 'INR',
      monthlyBudget: 50000,
      notifications: {
        email: true,
        budgetAlerts: true,
        monthlyReports: false
      },
      theme: 'light',
      dateFormat: 'DD-MM-YYYY'
    }
  )
  
  res.json({ message: 'All data cleared successfully' })
}
