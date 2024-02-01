const Recruiter = require('../models/recruiter')
const Job = require('../models/job')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, 'secret')
        const recruiter = await Recruiter.findOne({ _id: data._id })
        
        if(!recruiter) throw new Error('No recruiter found')

        req.recruiter = recruiter
        next()
    } catch (error) {
        res.status(401).send('Not authorized')
    }
}

exports.createRecruiter = async (req, res) => {
    try {
        const recruiter = new Recruiter(req.body)
        await recruiter.save()
        const token  = await recruiter.generateAuthToken()
        res.status(201).json({ recruiter, token })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.login = async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne({ email: req.body.email })
        if(!recruiter || !await bcrypt.compare(req.body.password, recruiter.password)) {
            res.status(400).send('Invalid login credentials')
        } else {
            const token = await recruiter.generateAuthToken()
            res.status(200).json({ recruiter, token })
        }
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.updateRecruiter = async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const recruiter = await Recruiter.findOne({ _id: req.params.id })
        updates.forEach(update => recruiter[update] = req.body[update])
        await recruiter.save()
        res.status(200).json(recruiter)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

exports.deleteRecruiter = async (req, res) => {
    try {
        await req.recruiter.deleteOne()
        res.status(200).json({ message: 'Recruiter Deleted'})
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


