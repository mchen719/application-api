const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    description: { type: String, required: true },
    salary: { type: Number, required: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applicant'}]
})

const Job = mongoose.model('Job', jobSchema)

module.exports = Job