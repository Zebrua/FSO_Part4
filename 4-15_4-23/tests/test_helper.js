const Blog = require('../models/blog')
const User = require('../models/user')
const {connect, disconnect} = require('../utils/middleware')

const initial_blogs = [
    {
        "title": "Pepper Sidcom",
        "author": "Nevel Recon",
        "url": "http://Peppersidc.con",
        "likes": 2
    },
    {
        "title": "GOGO_Blogging",
        "author": "Penol Damase",
        "url": "https://newBlogpage.con",
        "likes": 1
    },
    {
        "title": "New Blog",
        "author": "Thomas Hudson",
        "url": "https://newwave.con",
        "likes": 0
    }
]

const nonExistingId = async () => {
  await connect()
  const blog = new Blog({ "title": 'new' })
  await blog.save()
  await blog.deleteOne()
  await disconnect()
  return blog._id.toString()
}


const ArtifactsInDb = async () => {
  await connect()
  const blogs = await Blog.find({})
  await disconnect()
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  await connect()
  const users = await User.find({})
  await disconnect()
  return users.map(user => user.toJSON())
}



module.exports = {
  initial_blogs, nonExistingId, ArtifactsInDb, usersInDb
}