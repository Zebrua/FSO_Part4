const express = require('express')
const Router = express.Router({caseSensitive:false, strict:false})
const cors = require('cors')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const {connect, disconnect} =  require('../utils/middleware.js')
const ErrorHandler = require('../utils/error-handler.js')
const {getTokenFrom, userEstablisher} = require('../utils/token_handler.js')
Router.use(cors())
Router.use(express.static('../dist'))
Router.use(express.json())

const allowedOrigins = ["http://localhost:5173","http://localhost:3003"]

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET","POST","OPTIONS","DELETE","PUT"],
  credentials: true
}

Router.options('/', cors(corsOptions), (request,response,next) => {
  response.json(corsOptions)
})

Router.options('/:id', cors(corsOptions), (request,response,next) => {
  response.json(corsOptions)
})


Router.get('/',cors(corsOptions), async (request, response, next) => {
    await connect()
    Blog
      .find({})
      .then(async blogs => {
        await disconnect()
        response.json(blogs)
      })
      .catch(async error => {
        await disconnect()
        next(error)
      })
})

Router.get('/:id',cors(corsOptions), async (request,response,next) => {
    const id = request.params.id
    await connect()
    Blog.findById(id)
    .then(async post => {
      await disconnect()
      response.status(200).json(post)
    })
    .catch(async error => {
      await disconnect()
      next(error)
    })
})

Router.post('/', userEstablisher, cors(corsOptions), async (request, response, next) => {
    await connect()

    const body = request.body
    const uzr = request.user

    const blog = new Blog({
      title: body.title,
      author: uzr.name,
      url: body.url,
      likes: body.likes || 0,
      user: uzr.id
    })
    const result = await blog.save()
    uzr.blogs = uzr.blogs.concat(result.id)
    await uzr.save()
    .catch(async err => {
      await disconnect()
      next(err)
    })
    await disconnect()
    return response.status(201).json(result)

})

Router.put('/:id',cors(corsOptions), async (request, response, next) => {
    const body = request.body
    await connect()
    Blog.findByIdAndUpdate(body.id, {likes: body.likes}, {runValidator:true})
    .then(async result => { 
      await disconnect()
      return response.status(200).json(result) 
    })
    .catch(async error => {
      await disconnect()
      next(error)
    })
})

Router.delete('/:id', userEstablisher, cors(corsOptions), async (request, response, next) => {
  const id = request.params.id
  await connect()

  const body = request.body
  const uzr = request.user
  
  const toDelete = await Blog.findById(id)
  if (uzr.id != toDelete.user){
    await disconnect()
    return response.status(401).send({error: 'Only the author can acess the post'})
  }
  await Blog.deleteOne(toDelete)
  .catch(async err => {
    await disconnect()
    next(err)
  })
  await disconnect()
  return response.status(204).end()

})

Router.use(ErrorHandler)

module.exports = Router