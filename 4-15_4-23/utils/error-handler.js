const ErrorHandler = (error,request,response,next) => {
      console.log(error.message)
  if (error.name === "ValidationError") {
    return response.status(400).json({error: error.message})
  }else if (error.name === "CastError") {
    return response.status(400).send({error: "malformated id"})
  }else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected "username" to be unique' })
  }else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  }else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }else{
    return response.status(500).send({error: error.message})
  }
}

module.exports = ErrorHandler