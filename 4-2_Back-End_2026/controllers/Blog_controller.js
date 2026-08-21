const express = require('express')
const Router = express.Router({caseSensitive:false, strict:false})
const cors = require('cors')
const Blog = require('../models/blog.js')
const {connect, disconnect} =  require('../utils/middleware.js')
//const disconnect = require('../utils/middleware.js')
const ErrorHandler = require('../utils/error-handler.js')
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
      response.json(post)
    })
    .catch(async error => {
      await disconnect()
      next(error)
    })
})

Router.post('/',cors(corsOptions), async (request, response, next) => {
    await connect()
    const body = request.body
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    })
    blog.save()
      .then(async result => {
        await disconnect()
        return response.json(result)
      })
      .catch(async error => {
        await disconnect()
        next(error)
      })
})

Router.put('/:id',cors(corsOptions), async (request, response, next) => {
    const body = request.body
    await connect()
    Blog.findByIdAndUpdate(body.id, {likes: body.likes}, {runValidator:true})
    .then(async result => { 
      await disconnect()
      return response.json(result) 
    })
    .catch(async error => {
      await disconnect()
      next(error)
    })
})

Router.use(ErrorHandler)

module.exports = Router