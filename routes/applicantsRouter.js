const express = require('express')
const router = express.Router()
const applicantCtrl = require('../controllers/applicantsController')

//User Routes
router.post('/', applicantCtrl.createApplicant)
router.post('/login', applicantCtrl.login)
router.get('/:id', applicantCtrl.show)
router.put('/:id', applicantCtrl.updateApplicant)
router.delete('/:id', applicantCtrl.auth, applicantCtrl.deleteApplicant)

//Many to Many relationship routes for applicant to apply for a job 
router.post('/:applicantId/apply/:jobId', applicantCtrl.apply)
router.get('/:applicantId/appliedJobs', applicantCtrl.index)

module.exports = router