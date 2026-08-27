const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const {connect, disconnect} = require('../utils/middleware')
const api = supertest(app)

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

test('Artifacs are returned as json', async () => {
  await api
    .get('/api')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('All artifacts are returned', async () => {
  const response = await api.get('/api')

  assert.strictEqual(response.body.length, helper.initial_blogs.length)
})

test('A specific blog is within the returned artifacts', async () => {
  const blogsAtStart = await api
  .get(`/api`)
  .expect(200)
  .expect('Content-Type', /application\/json/)

  const blogAtStart = blogsAtStart.body.find(({title}) => title === "GOGO_Blogging")

  const checkById = await api
  .get(`/api/${blogAtStart.id}`)
  .expect(200)
  .expect('Content-Type', /application\/json/)

  console.log(checkById.body.user)
  console.log(blogAtStart.user)

  assert.deepStrictEqual(checkById.body, blogAtStart)
})

test('A valid blog can be added ', async () => {
  const newBlog =    {
        title: "New Title",
        author: "Mon chier",
        url: "https://noteworthy.con",
        likes: 2
    }

  const LoggedUser = await api
  .post('/login')
  .send({username: 'root',password: 'sekret'}) 
  .expect(200) 

  await api
    .post('/api')
    .set('authorization', `Bearer ${LoggedUser.body.token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogsAtEnd = await helper.ArtifactsInDb()

  const titles = blogsAtEnd.map(k => k.title)

  assert.strictEqual(blogsAtEnd.length, helper.initial_blogs.length + 1)

  assert(titles.includes("New Title"))
})

test('Blog with missing content is not added', async () => {
  const newPost = {
    title: ""
  }
  const LoggedUser = await api
  .post('/login')
  .send({username: 'root',password: 'sekret'}) 
  .expect(200) 

  await api
    .post('/api')
    .set('authorization', `Bearer ${LoggedUser.body.token}`)
    .send(newPost)
    .expect(400)

  const blogsAtEnd = await helper.ArtifactsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initial_blogs.length)
})

test('New Artifact has base value for likes', async () => {
    const testBlog = {
        title: "Test Blog",
        author: "Belvie Fastorn",
        url: "https://newman.con"
    }

    const LoggedUser = await api
    .post('/login')
    .send({username: 'root',password: 'sekret'}) 
    .expect(200) 

    await api
    .post('/api')
    .set('authorization', `Bearer ${LoggedUser.body.token}`)
    .send(testBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.ArtifactsInDb()
    const newBlog = blogsAtEnd[3]

    assert.strictEqual(newBlog.likes, 0)

})

test('An artifact can be deleted', async () => {
  const blogsAtStart = await helper.ArtifactsInDb()
  const blogToDelete = blogsAtStart[0]

  const LoggedUser = await api
  .post('/login')
  .send({username: 'root',password: 'sekret'}) 
  .expect(200) 

  await api
    .delete(`/api/${blogToDelete.id}`)
    .set('authorization', `Bearer ${LoggedUser.body.token}`)
    .expect(204)

  const blogsAtEnd = await helper.ArtifactsInDb()

  const ids = blogsAtEnd.map(h => h.id)
  assert(!ids.includes(blogToDelete.id))

  assert.strictEqual(blogsAtEnd.length, helper.initial_blogs.length - 1)
})

test('Likes can be updated via put', async () => {
  const blogsAtStart = await helper.ArtifactsInDb()
  const blogToUpdate = blogsAtStart[0]
  blogToUpdate.likes += 1

  await api
    .put(`/api/${blogToUpdate.id}`)
    .send(blogToUpdate)
    .expect(200)

  const blogsAtEnd = await helper.ArtifactsInDb()

  const blog = blogsAtEnd.find(({id}) => id === blogToUpdate.id)

  assert.strictEqual(blog.likes, blogToUpdate.likes)
})

test('Sending request to incorrect id returns error', async () => {
    const testBlog = {
        title: "Test Blog",
        author: "Belvie Fastorn",
        url: "https://newman.con",
        id: "13212312"
    }
  const LoggedUser = await api
  .post('/login')
  .send({username: 'root',password: 'sekret'}) 
  .expect(200) 

    
  const rDel = await api
    .delete(`/api/13212312`)
    .set('authorization', `Bearer ${LoggedUser.body.token}`)
    .expect(400)

  const rPut = await api
    .put(`/api/13212312`)
    .send(testBlog)
    .expect(400)
    
  const rGet = await api
    .get(`/api/13212312`)
    .set('authorization', `Bearer ${LoggedUser.body.token}`)
    .expect(400)



  assert.strictEqual(rDel.error.text, '{"error":"malformated id"}')
  assert.strictEqual(rPut.error.text, '{"error":"malformated id"}')
  assert.strictEqual(rGet.error.text, '{"error":"malformated id"}')
})

after(async () => {
  await mongoose.connection.close()
})