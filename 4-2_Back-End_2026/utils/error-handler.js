const ErrorHandler = (error,request,response,next) => {
      console.log(error.message)
  if (error.name === "ValidationError") {
    return response.status(400).json({error: error.message})
  }else if (error.name === "CastError") {
    return response.status(400).send({error: "malformated id"})
  }else{
    return response.status(500).send({error: error.message})
  }
}

module.exports = ErrorHandler