const Blog = require('../models/blog')
const {connect, disconnect} = require('../utils/middleware')

const initial_blogs = [
    {
        "title": "Pepper Sidcom",
        "author": "Nevel Recon",
        "url": "http://Peppersidc.con",
        "likes": 2,
        "id": "66c8ae86faa26eb9639a5089"
    },
    {
        "title": "GOGO_Blogging",
        "author": "Penol Damase",
        "url": "https://newBlogpage.con",
        "likes": 1,
        "id": "6a885e03412c5541469164dc"
    },
    {
        "title": "New Blog",
        "author": "Thomas Hudson",
        "url": "https://newwave.con",
        "likes": 0,
        "id": "6a885f69cd97215fb8ba6908"
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

module.exports = {
  initial_blogs, nonExistingId, ArtifactsInDb
}
