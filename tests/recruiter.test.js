const mongoose = require('mongoose')
const Recruiter = require('../models/recruiter')
const Job = require('../models/job')
const app = require('../app')
const { MongoMemoryServer } = require('mongodb-memory-server')
const request = require('supertest')
const server = app.listen('3001', () => console.log('Lets Test'))

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

describe('Testing Recruiter Endpoints for a restful JSON API', () => {
    test('It should create a new recruiter', async () => {
        const response = await request(app).post('/recruiters').send({
            name: 'Matthew',
            email: 'goat@goat.com',
            password: 'password', 
            createdJobs: []
        })
        expect(response.body.recruiter.name).toEqual('Matthew')
        expect(response.body.recruiter.email).toEqual('goat@goat.com')
        expect(response.body.recruiter.createdJobs).toStrictEqual([])
    })

    test('Given an existing recruiter, it should update an existing recruiter and return it', async () => {
        const recruiter = new Recruiter({name: 'Matthew', email: 'goat@goat.com', password: 'password', createdJobs: []})
        await recruiter.save()

        const response = await request(app).put(`/recruiters/${recruiter._id}`).send({
            email: 'Goat@goat.com'
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.email).toEqual('Goat@goat.com')
    })

    test('It should delete a pre-existing recruiter given a valid ID', async () => {
        const recruiter = new Recruiter({name: 'Matthew', email: 'goat@goat.com', password: 'password', createdJobs: []})
        const token = recruiter.generateAuthToken()
        await recruiter.save()

        const response = await request(app).delete(`/recruiters/${recruiter._id}`)
        .set({ 'Authorization': `Bearer ${token}` })

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toEqual('Recruiter Deleted')
    })
})
