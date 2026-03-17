const Transaction = require('../models/Transaction')

function httpError(statusCode, message) {
  const err = new Error(message)
  err.statusCode = statusCode
  return err
}

function pickTx(body = {}) {
  return {
    title: String(body.title || '').trim(),
    type: body.type === 'income' ? 'income' : 'expense',
    category: String(body.category || 'Other').trim() || 'Other',
    amount: Math.abs(Number(body.amount || 0)),
    method: String(body.method || 'UPI').trim() || 'UPI',
    date: String(body.date || '').trim(),
    notes: String(body.notes || '').trim(),
  }
}

exports.listTransactions = async (req, res) => {
  const { type, category, q, from, to, limit = 200 } = req.query

  const filter = {}
  if (type === 'expense' || type === 'income') filter.type = type
  if (category) filter.category = category
  if (from || to) {
    filter.date = {}
    if (from) filter.date.$gte = String(from)
    if (to) filter.date.$lte = String(to)
  }
  if (q) {
    const re = new RegExp(String(q), 'i')
    filter.$or = [{ title: re }, { category: re }, { method: re }, { notes: re }]
  }

  const items = await Transaction.find(filter)
    .sort({ date: -1, createdAt: -1 })
    .limit(Math.min(Number(limit) || 200, 500))

  res.json({ items })
}

exports.getTransaction = async (req, res) => {
  const tx = await Transaction.findById(req.params.id)
  if (!tx) throw httpError(404, 'Transaction not found')
  res.json({ item: tx })
}

exports.createTransaction = async (req, res) => {
  const tx = pickTx(req.body)
  if (!tx.title) throw httpError(400, 'title is required')
  if (!tx.date) throw httpError(400, 'date is required (YYYY-MM-DD)')
  if (!Number.isFinite(tx.amount) || tx.amount <= 0) {
    throw httpError(400, 'amount must be > 0')
  }

  const created = await Transaction.create(tx)
  res.status(201).json({ item: created })
}

exports.updateTransaction = async (req, res) => {
  const patch = pickTx({ ...req.body })

  const updated = await Transaction.findByIdAndUpdate(req.params.id, patch, {
    new: true,
    runValidators: true,
  })

  if (!updated) throw httpError(404, 'Transaction not found')
  res.json({ item: updated })
}

exports.deleteTransaction = async (req, res) => {
  const deleted = await Transaction.findByIdAndDelete(req.params.id)
  if (!deleted) throw httpError(404, 'Transaction not found')
  res.json({ ok: true })
}

exports.getSummary = async (req, res) => {
  const { month } = req.query // YYYY-MM
  const match = {}
  if (month) {
    match.date = { $gte: `${month}-01`, $lte: `${month}-31` }
  }

  const agg = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ])

  const income = agg.find((x) => x._id === 'income')?.total ?? 0
  const expense = agg.find((x) => x._id === 'expense')?.total ?? 0
  res.json({
    income,
    expense,
    net: income - expense,
  })
}

