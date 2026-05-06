const express = require('express')
const ctrl = require('../controllers/transactionController')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

function wrap(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/', requireAuth, wrap(ctrl.listTransactions))
router.get('/summary', requireAuth, wrap(ctrl.getSummary))
router.get('/:id', requireAuth, wrap(ctrl.getTransaction))
router.post('/', requireAuth, wrap(ctrl.createTransaction))
router.put('/:id', requireAuth, wrap(ctrl.updateTransaction))
router.delete('/:id', requireAuth, wrap(ctrl.deleteTransaction))

module.exports = router

