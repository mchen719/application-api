const mongoose = require('mongoose')
const app = require('../app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
const server = app.listen('8080', () => console.log('Lets Test'))
const Job = require('../models/job')
const Recruiter = require('../models/recruiter')
let mongoServer 

beforeAll( async () => {
    mongoServer = await MongoMemoryServer.create()
    await mongoose.connect(mongoServer.getUri())
})

afterAll( async () => {
    await mongoose.connection.close()
    mongoServer.stop()
    server.close()
})

describe('Testing Job Endpoints for a restful JSON API', () => {
    test('it should list the job applicantions available', async () => {
        const job = new Job({ title: 'Software Developer', description: 'The software developer will develop new web applications.', salary: 150000, applicants: []})
        await job.save()

        const response = await request(app).get('/jobs') 

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body)).toBeTruthy()

        for(let i = 0; i < response.body.length; i++){
            expect(response.body[i]).toHaveProperty('title')
            expect(response.body[i]).toHaveProperty('description')
            expect(response.body[i]).toHaveProperty('salary')
            expect(response.body[i]).toHaveProperty('applicants')
        }  
    })

    test('Given a valid recruiter, it should create a new job posting', async () => {
        const recruiter = new Recruiter({name: 'Matthew', email: 'goat@goat.com', password: 'password', createdJobs: []})
        const token = recruiter.generateAuthToken()
        await recruiter.save()

        const response = await request(app).post('/jobs').send({
            title: 'Software Developer', 
            description: 'The software developer will develop new web applications.', 
            salary: 150000, 
            applicants: []
        }).set({ 'Authorization': `Bearer ${token}` })

        console.log(response.body)
        expect(response.body.newJob.title).toEqual('Software Developer')
        expect(response.body.newJob.description).toEqual('The software developer will develop new web applications.')
        expect(response.body.newJob.salary).toEqual(150000)
        expect(response.body.newJob.applicants).toStrictEqual([])
        expect(response.body.recruiter.createdJobs[0]).toEqual(response.body.newJob._id.toString())
    })

    test('It should show a pre-existing job given a vailid id', async () => {
        const job = new Job({ title: 'Software Developer', description: 'The software developer will develop new web applications.', salary: 150000, applicants: []})
        await job.save()

        const response = await request(app).get(`/jobs/${job._id}`)

        expect(response.body.title).toEqual('Software Developer')
        expect(response.body.description).toEqual('The software developer will develop new web applications.')
        expect(response.body.salary).toEqual(150000)
        expect(response.body.applicants).toStrictEqual([])
    })
})
