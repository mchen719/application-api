const mongoose = require('mongoose')
const Applicant = require('../models/applicant')
const Job = require('../models/job')
const app = require('../app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
const server = app.listen('3000', () => console.log('Lets Test'))

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

describe('Testing Applicant Endpoints for a restful JSON API', () => {
    test('It should create a new applicant', async () => {
        const response = await request(app).post('/applicants').send({
            name: 'Matthew',
            email: 'goat@goat.com',
            password: 'password', 
            appliedJobs: []
        })
        expect(response.body.applicant.name).toEqual('Matthew')
        expect(response.body.applicant.email).toEqual('goat@goat.com')
        expect(response.body.applicant.appliedJobs).toStrictEqual([])
    })

    test('Given an existing applicant, it should update an existing applicant and return it', async () => {
        const applicant = new Applicant({name: 'Matthew', email: 'goat@goat.com', password: 'password', appliedJobs: []})
        await applicant.save()

        const response = await request(app).put(`/applicants/${applicant._id}`).send({
            email: 'Goat@goat.com'
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.email).toEqual('Goat@goat.com')
    })

    test('It should delete a pre-existing applicant given a valid ID', async () => {
        const applicant = new Applicant({name: 'Matthew', email: 'goat@goat.com', password: 'password', appliedJobs: []})
        const token = applicant.generateAuthToken()
        await applicant.save()

        const response = await request(app).delete(`/applicants/${applicant._id}`)
        .set({ 'Authorization': `Bearer ${token}` })

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('Applicant Deleted')
    })

    test('It should allow an existing applicant to apply to a job posting', async () => { 
        const applicant = new Applicant({name: 'Matthew', email: 'goat@goat.com', password: 'password', appliedJobs: []})
        await applicant.save()
        
        const job = new Job({ title: 'Software Developer', description: 'The software developer will develop new web applications.', salary: 150000, applicants: []})
        await job.save()

        const  response = await request(app).post(`/applicants/${applicant._id}/apply/${job._id}`)

        expect(response.statusCode).toBe(200)
        expect(response.body.job.applicants[0]).toBe(applicant._id.toString())
        expect(response.body.applicant.appliedJobs[0]).toBe(job._id.toString())
    })

    test('It should show all the jobs the applicant applied to', async () => {
        const job = new Job({ title: 'Software Developer', description: 'The software developer will develop new web applications.', salary: 150000, applicants: []})
        await job.save()

        const applicant = new Applicant({name: 'Matthew', email: 'goat@goat.com', password: 'password', appliedJobs: [job._id]})
        await applicant.save()
        
        const response = await request(app).get(`/applicants/${applicant._id}/appliedJobs`)

        expect(response.body[0].title).toEqual('Software Developer')
        expect(response.body[0].description).toEqual('The software developer will develop new web applications.')
        expect(response.body[0].salary).toEqual(150000)
    })
})