const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { application } = require('express')

const applicantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, 
    appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'job'}]
})

applicantSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

applicantSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id }, 'secret')
    return token
}

const Applicant = mongoose.model('Applicant', applicantSchema)

module.exports = Applicant