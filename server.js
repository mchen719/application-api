require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')
const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI)
mongoose.connection.once('open', () => {
    console.log('MongoDB is connected')
}) 

app.listen(PORT, () => {
    console.log(`Connected to PORT ${PORT}`)
})