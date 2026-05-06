const express = require('express')
const ctrl = require('../controllers/settingsController')
const { requireAuth } = require('../middleware/auth')

const router = express.Router()

function wrap(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
}

router.get('/', requireAuth, wrap(ctrl.getSettings))
router.put('/', requireAuth, wrap(ctrl.updateSettings))
router.delete('/clear-all', requireAuth, wrap(ctrl.clearAllData))

module.exports = router
