const express = require('express')
const ctrl = require('../controllers/authController')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

function wrap(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

router.post('/signup', wrap(ctrl.signup))
router.post('/login', wrap(ctrl.login))
router.get('/me', requireAuth, wrap(ctrl.me))

module.exports = router

