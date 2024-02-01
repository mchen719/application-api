const Job = require('../models/job')
const Recruiter = require('../models/recruiter')


exports.create = async (req, res) => {
    try {
        const newJob = await Job.create(req.body)
        
        req.recruiter.createdJobs.push(newJob._id)
        req.recruiter.save()

        res.status(201).json({
            message: `${req.recruiter.name} created the job ${newJob.title}`,
            newJob,
            recruiter: req.recruiter
        })
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