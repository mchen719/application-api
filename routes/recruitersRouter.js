const express = require('express')
const router = express.Router()
const recruiterCtrl = require('../controllers/recruitersController')

//User Routes
router.post('/', recruiterCtrl.createRecruiter)
router.post('/login', recruiterCtrl.login)
router.put('/:id', recruiterCtrl.updateRecruiter)
router.delete('/:id', recruiterCtrl.auth, recruiterCtrl.deleteRecruiter)

module.exports = router