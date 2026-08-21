const express = require('express')
const cors = require('cors')
const app = express()
const Router = require('./controllers/Blog_controller.js')
const {Mongodb_URI, PORT} = require('./utils/config')

app.use(cors())
app.use(express.static('dist'))
app.use('/api',Router)

app.listen(PORT  || 3003, () => {
  console.log(`Server running on port ${PORT}`)
})
