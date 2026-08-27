const {connect, disconnect} = require('./middleware')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return (authorization.replace('Bearer ', ''))
    }
    return null
}

const userEstablisher = async (request,response,next) => {
    await connect()
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const uzr = await User.findById(decodedToken.id)
    await disconnect()
    request.user =  uzr

    next()
}
  
module.exports = {getTokenFrom, userEstablisher}