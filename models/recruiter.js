const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const recruiterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, 
    createdJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job'}]
})

recruiterSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

recruiterSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, 'secret')
    return token
}

const Recruiter = mongoose.model('Recruiter', recruiterSchema)

module.exports = Recruiter