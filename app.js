const express = require('express')
const app = express()
const jobsRouter = require('./routes/jobsRouter')
const applicantsRouter = require('./routes/applicantsRouter')

app.use(express.json())
app.use('/jobs', jobsRouter)
app.use('/applicants', applicantsRouter)

module.exports = app 