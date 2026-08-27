const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const {connect, disconnect} = require('../utils/middleware')
const { AssertionError } = require('node:assert/strict')
const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await  connect()
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root',name: 'Thomas Hudson',passwordHash: passwordHash })
    await user.save()
    disconnect()

    const LoggedUser = await api
    .post('/login')
    .send({username: 'root', password: 'sekret'})


    for (let post of helper.initial_blogs) {
        const result = await api
        .post('/api')
        .set('authorization', `Bearer ${LoggedUser.body.token}`)
        .send(post)
    }

  })

  test('Creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()


    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/sign')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })


  test('Creation fails with proper statuscode and message if username already exists', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/sign')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected "username" to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Creation fails with proper status code and message if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const testUser = {
      username: 'TommyH',
      name: 'Thomas Hudson',
      password: 'PW',
    }

    const result = await api
    .post('/sign')
    .send(testUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('Password has to be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

    test('Creation fails with proper status code and message if login is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const testUser = {
      username: 'TH',
      name: 'Thomas Hudson',
      password: 'testPass',
    }

    const result = await api
    .post('/sign')
    .send(testUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('User validation failed: username:'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('Login backend functionality works', async () => {
    const myUser = {
        username: 'root',
        password: 'sekret'
    }

    const result = await api
    .post('/login')
    .send(myUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)


    assert(result.body.user.username, myUser.username)
  })

  test('Creation of a new blogpost is done after login references the authorised user', async () => {
     const myUser = {
        username: 'root',
        password: 'sekret'
    }

    const myBlog = {
        title: "BlogWithAuthorisation",
        url: "https://newblogsourse.con"
    }

    const LoggedUser = await api
    .post('/login')
    .send(myUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)


    const result = await api
    .post('/api')
    .set('authorization', `Bearer ${LoggedUser.body.token}`)
    .send(myBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)


    assert(result.body.user, LoggedUser.body.user.id)
  })

  test('Creation of a new blogpost is failed without tocken-authorised user', async () => {

    const myBlog = {
        title: "BlogWithAuthorisation",
        url: "https://newblogsourse.con"
    }

    const faultyToken = "12223333.34245555555555.56132123123"

    const result = await api
    .post('/api')
    .set('authorization', `Bearer ${faultyToken}`)
    .send(myBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
    

    assert(result.body.error.includes('invalid token'))
  })

  test('It is possible to delete an existing blogpost with proper authorization', async () => {
    const postsAtStart = await helper.ArtifactsInDb()

    const myUser = {
        username: 'root',
        password: 'sekret'
    }

    const blogToDelete = postsAtStart[0].id

    const LoggedUser = await api
    .post('/login')
    .send(myUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    const result = await api
    .delete(`/api/${blogToDelete}`)
    .set('authorization', `Bearer ${LoggedUser.body.token}`)
    .expect(204)

    const postsAtEnd = await helper.ArtifactsInDb()
    assert.strictEqual(postsAtEnd.length, postsAtStart.length - 1)
  })

  test('Attempt to remove a blogpost without prior authorization fails', async () => {
    const postsAtStart = await helper.ArtifactsInDb()

    const blogToDelete = postsAtStart[0].id
    
    const result = await api
    .delete(`/api/${blogToDelete}`)
    .set('authorization', `Bearer 12223333.34245555555555.561321231232`)
    .expect(401)

    console.log(result.body.error)
    
    const postsAtEnd = await helper.ArtifactsInDb()
    assert.strictEqual(postsAtEnd.length, postsAtStart.length)
    assert(result.body.error.includes('invalid token'))
  })

})



after(async () => {
  await mongoose.connection.close()
})