const express = require('express')
const app = express()
const jobsRouter = require('./routes/jobsRouter')
const applicantsRouter = require('./routes/applicantsRouter')
const recruiterRouter = require('./routes/recruitersRouter')


app.use(express.json())
app.use('/jobs', jobsRouter)
app.use('/applicants', applicantsRouter)
app.use('/recruiters', recruiterRouter)

module.exports = app 