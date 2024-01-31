const Applicant = require('../models/applicant')
const Job = require('../models/job')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, 'secret')
        const applicant = await Applicant.findOne({ _id: data._id })
        
        if(!applicant) throw new Error('No applicant found')

        req.applicant = applicant
        next()
    } catch (error) {
        res.status(401).send('Not authorized')
    }
}

exports.createApplicant = async (req, res) => {
    try {
        const applicant = new Applicant(req.body)
        await applicant.save()
        const token  = await applicant.generateAuthToken()
        res.status(201).json({ applicant, token })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.login = async (req, res) => {
    try {
        const applicant = await Applicant.findOne({ email: req.body.email })
        if(!applicant || !await bcrypt.compare(req.body.password, applicant.password)) {
            res.status(400).send('Invalid login credentials')
        } else {
            const token = await applicant.generateAuthToken()
            res.status(200).json({ applicant, token })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.show = async (req, res) => {
    try {
        const foundApplicant = await Applicant.findOne({ _id: req.params.id })
        res.status(200).json(foundApplicant)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

exports.updateApplicant = async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const applicant = await Applicant.findOne({ _id: req.params.id })
        updates.forEach(update => applicant[update] = req.body[update])
        await applicant.save()
        res.status(200).json(applicant)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteApplicant = async (req, res) => {
    try {
        await req.applicant.deleteOne()
        res.status(200).json({ message: 'Applicant Deleted'})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.apply = async (req, res) => {
    try {
        const foundApplicant = await Applicant.findOne({ _id: req.params.applicantId })
        if(!foundApplicant) throw new Error(`Could not find applicant with ID: ${req.params.applicantId}`)

        const foundJob = await Job.findOne({ _id: req.params.jobId })
        if(!foundJob) throw new Error(`Could not find job with ID: ${req.params.jobId}`)

        foundApplicant.appliedJobs.push(foundJob._id)
        foundJob.applicants.push(foundApplicant._id)
        
        await foundApplicant.save()
        await foundJob.save()

        res.status(200).json({
            message: `Succesfully applied to job with ID: ${req.params.jobId}`,
            job: foundJob,
            applicant: foundApplicant
        })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.index = async (req, res) => {
    try {
        const applicant = await Applicant.findById(req.params.applicantId).populate('appliedJobs')
        if(!applicant) throw new Error(`No applicant with ID: ${req.params.applicantId} found`)

        res.status(200).send(applicant.appliedJobs)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}