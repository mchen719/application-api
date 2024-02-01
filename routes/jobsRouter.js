const express = require('express')
const router = express.Router()
const jobCtrl = require('../controllers/jobsController')
const recruiterCtrl = require('../controllers/recruitersController')

router.post('/', recruiterCtrl.auth, jobCtrl.create)
router.get('/', jobCtrl.index)
router.get('/:id', jobCtrl.show)

module.exports = router