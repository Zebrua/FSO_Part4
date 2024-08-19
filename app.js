const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const Router = require('./controllers/Blog_controller.js')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const start = async () => {
    try {
      await mongoose.connect(config.MONGODB_URI, options= {dbName:"Blog"})
    } catch (error){
      console.log(error.message)
    }
}
start()

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.use('/api/blogs', Router)

module exports = app