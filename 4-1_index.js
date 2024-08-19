const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Blog = mongoose.model('Blog', blogSchema)


const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, options= {dbName:"Blog"})
  } catch (error){
    console.log(error.message)
  }
}
start()
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
    .catch(error => next(error))
})

app.get('/api/blogs/:id', (request,response,next) => {
  const id = request.params.id
  Blog.findById(id)
  .then(post => response.json(post))
  .catch(error => next(error))
})

app.post('/api/blogs', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

app.put('/api/blogs/:id', (request, response, next) => {
  const body = request.body
  const likes = body.likes + 1
  Blog.findByIdAndUpdate(body.id, {likes: likes}, {runValidator:true})
  .then(result => { response.json(result) })
  .catch(error=>next(error))
})

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
