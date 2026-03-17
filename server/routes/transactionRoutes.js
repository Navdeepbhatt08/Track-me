const express = require('express')
const ctrl = require('../controllers/transactionController')

const router = express.Router()

function wrap(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/', wrap(ctrl.listTransactions))
router.get('/summary', wrap(ctrl.getSummary))
router.get('/:id', wrap(ctrl.getTransaction))
router.post('/', wrap(ctrl.createTransaction))
router.put('/:id', wrap(ctrl.updateTransaction))
router.delete('/:id', wrap(ctrl.deleteTransaction))

module.exports = router

