const Blog = require('../models/blog.js')

initialList = [
    {
      "title": "NewTitle",
      "author": "ME",
      "url": "http:/bussdownforwhat.con",
      "likes": 3,
      "id": "66c5eadeb3a72e48fb2eef91"
    },
    {
      "title": "Pepper Sidcom",
      "author": "Nevel Recon",
      "url": "http://Peppersidc.con",
      "likes": 1,
      "id": "66c5eadeb3a72e48fb2eef84"
    }
]

const DB_List = async () => {
    const BlogPosts = await Blog.find({})
    return BlogPosts.map(blog => blog.toJSON())
}

module.exports = { initialList, DB_List }
