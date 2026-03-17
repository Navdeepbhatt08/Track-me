require('dotenv').config()

const connectDB = require('./config/db')
const app = require('./app')

connectDB()

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log('Server is running on port', port)
})