const bcrypt = require('bcrypt')
const UseRouter = require('express').Router()
const {connect, disconnect} = require('../utils/middleware')
const ErrorHandler = require('../utils/error-handler')
const User = require('../models/user')

UseRouter.post('/', async (request, response, next) => {
  const body = request.body
  if (body.password.length < 3) {
    return response.status(400).send({error: "Password has to be at least 3 characters long"})
  }else{
    await connect()
    
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const uzr = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    })

    uzr.save()
    .then(async result => {
        await disconnect()
        return response.status(201).json(result)
    })
    .catch(async error => {
        await disconnect()
        next(error)
    })
  }
})

UseRouter.get('/', async (request, response, next) => {
  await connect()
  await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1 })
  .then(async result => {
    await disconnect()
    return response.json(result)
  })
  .catch(async error => {
    await disconnect()
    next(error)
  } )
})

UseRouter.use(ErrorHandler)

module.exports = UseRouter