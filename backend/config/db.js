require('dotenv').config()
const mongoose = require('mongoose')
const { MONGO_URI } = require('./routing')


mongoose.set('strictQuery', false)
const db =  mongoose.connect(MONGO_URI)

 module.exports = db