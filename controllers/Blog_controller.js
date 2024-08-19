const Router = require('express').Router()
const Blog = require('../models/blog.js')

Router.get('/', (request, response, next) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
      .catch(error => next(error))
})

Router.get('/:id', (request,response,next) => {
    const id = request.params.id
    Blog.findById(id)
    .then(post => response.json(post))
    .catch(error => next(error))
})

Router.post('/', (request, response, next) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
      .catch(error => next(error))
})

Router.put('/:id', (request, response, next) => {
    const body = request.body
    const likes = body.likes + 1
    Blog.findByIdAndUpdate(body.id, {likes: likes}, {runValidator:true})
    .then(result => { response.json(result) })
    .catch(error=>next(error))
})

module.exports = Router