const mongoose = require('mongoose')

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      unique: true 
    },
    name: { 
      type: String, 
      required: true, 
      trim: true, 
      maxlength: 80,
      default: 'User' 
    },
    currency: { 
      type: String, 
      required: true, 
      enum: ['INR', 'USD', 'EUR', 'GBP'], 
      default: 'INR' 
    },
    monthlyBudget: { 
      type: Number, 
      required: true, 
      min: 0, 
      default: 50000 
    },
    notifications: {
      email: { type: Boolean, default: true },
      budgetAlerts: { type: Boolean, default: true },
      monthlyReports: { type: Boolean, default: false }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    dateFormat: {
      type: String,
      enum: ['DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD'],
      default: 'DD-MM-YYYY'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('UserSettings', UserSettingsSchema)
