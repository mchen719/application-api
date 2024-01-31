const express = require('express')
const router = express.Router()
const jobCtrl = require('../controllers/jobsController')

router.post('/', jobCtrl.create)
router.get('/', jobCtrl.index)
router.get('/:id', jobCtrl.show)

module.exports = router