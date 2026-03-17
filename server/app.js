const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const transactionRoutes = require('./routes/transactionRoutes')
const authRoutes = require('./routes/authRoutes')
const { notFound } = require('./middleware/notFound')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(express.json({ limit: '1mb' }))
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true,
  }),
)
app.use(morgan('dev'))

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/transactions', transactionRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app