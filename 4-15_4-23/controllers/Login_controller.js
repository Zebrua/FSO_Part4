const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const LoginR = require('express').Router()
const {connect, disconnect} = require('../utils/middleware')
const ErrorHandler = require('../utils/error-handler')
const User = require('../models/user')

LoginR.post('/', async (request, response) => {
  const body = request.body

  await connect()
  const user = await User.findOne({ username: body.username })
  await disconnect()

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
  

  response.status(200).send({ token, user})
})

LoginR.use(ErrorHandler)

module.exports = LoginR