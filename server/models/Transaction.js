const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    type: { type: String, enum: ['expense', 'income'], required: true },
    category: { type: String, required: true, trim: true, maxlength: 50 },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, trim: true, maxlength: 30, default: 'UPI' },
    date: { type: String, required: true }, // YYYY-MM-DD
    notes: { type: String, trim: true, maxlength: 500, default: '' },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Transaction', TransactionSchema)

