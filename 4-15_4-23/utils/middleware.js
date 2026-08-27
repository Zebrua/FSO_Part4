const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const MONGODB_URI = require('./config')

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, options= {dbName:"Blog"})
    console.log('Sucsessful connection.')
  } catch (error){
    console.log(error.message)
  }
}

const disconnect = async () => {
    await mongoose.connection.close()
    console.log('Disconnected successfuly.')
}



module.exports = {connect, disconnect}