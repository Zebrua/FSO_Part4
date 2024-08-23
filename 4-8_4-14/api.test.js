const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const logger = require('../utils/logger.js')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    helper.initialList.forEach(async (blog) => {
        let blogPost = new Blog(blog)
        await blogPost.save()
    })
    logger.info("done")
})

test('posts are returned as JSON', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('post has the correct id', async () => {
    const response = await helper.DB_List()
    const instance = response[0]
    if (instance.id){
        assert(20<30)
    }else{
        assert(20>30,"Post should have a proper id")
    }
})

test('post parameter *likes has a base value of 0', async () => {
    const newPost = {
        title: "This is a quiz that you skip",
        author: "Nokarto Veri",
        url: "http://thisisareal.quis/orr"
    }
    
    await api.post('/api/blogs').send(newPost)
    
    const response = await helper.DB_List()
    const posted = response[2]

    assert.strictEqual(posted.likes, 0)
})

test('a valid post can be added', async () => {
    const newPost = {
        title: "No regrets on the front..end",
        author: "Valillo Semino",
        url: "http://no-more.net/post1",
        likes: 0
    }

    await api
    .post('/api/blogs')
    .send(newPost)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const finalCond = await helper.DB_List()
    
    assert.strictEqual(finalCond.length, helper.initialList.length+1)
})

test('post without content is not added', async () => {
    const newPost = {
        author: "Valillo Semino",
        url: "http://no-more.net/post1",
        likes: 0
    }

    await api
    .post('/api/blogs')
    .send(newPost)
    .expect(400)

    const finalCond = await helper.DB_List()

    assert.strictEqual(finalCond.length, helper.initialList.length)
})

test('a post can be deleted', async () => {
    const pick = await helper.DB_List()
    const select = pick[0]
    //console.log(select.id)
    await api
    .delete(`/api/blogs/${select.id}`)
    .expect(204)

    const finalCond = await helper.DB_List()
    const contents = finalCond.map(r => r.content)
    assert(!contents.includes(select.id))

    assert.strictEqual(finalCond.length, helper.initialList.length-1)
})

test('casting a put request changes amount of likes', async () => {
    const initialList = await helper.DB_List()
    const select = initialList[0]

    await api
    .put(`/api/blogs/${select.id}`)
    .send(select)
    .expect(202)

    const finalCond = await helper.DB_List()
    const fin = finalCond[0]
    console.log("ender", fin)

    assert.strictEqual(fin.likes,select.likes+1)


})

after(async () => {
    await mongoose.connection.close()
})
