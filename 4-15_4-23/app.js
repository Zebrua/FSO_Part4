const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const Router = require('./controllers/Blog_controller.js')
const LoginR = require('./controllers/Login_controller.js')
const UseRouter = require('./controllers/User_controller.js')
const logger = require('./utils/logger')
const getTokenFrom = require('./utils/token_handler.js')
const mongoose = require('mongoose')


app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.use('/api', Router)
app.use('/sign', UseRouter)
app.use('/login', LoginR)

module.exports = app
