const Job = require('../models/job')

exports.create = async (req, res) => {
    try {
        const createdJob = await Job.create(req.body)
        res.status(201).json(createdJob)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

exports.index = async (req, res) => {
    try {
        const foundJob = await Job.find({})
        res.status(200).json(foundJob)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}

exports.show = async (req, res) => {
    try {
        const foundJob = await Job.findOne({ _id: req.params.id })
        res.status(200).json(foundJob)
    } catch (error) {
        res.status(400).send({ message: error.message })
    }
}