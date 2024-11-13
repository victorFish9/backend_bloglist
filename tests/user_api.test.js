const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

describe('when there is initially one user in the db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const user = new User({ username: 'root', passwordHash: 'hashedpassword' })
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await usersInDb()

        const newUser = {
            username: 'newuser',
            name: 'New User',
            password: 'securepassword',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with a 400 status if username is taken', async () => {
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'password123',
        }

        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert(response.body.error.includes('Username must be unique'))
    })


    test('creation fails with a 400 status if username or password is too short', async () => {
        const newUser = { username: 'ab', name: 'Short User', password: 'pw' }

        const response = await api.post('/api/users').send(newUser).expect(400)
        assert(response.body.error.includes('must be at least 3 characters long'))
    })
})

after(async () => {
    await mongoose.connection.close()
})
