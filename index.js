'use strict'
require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const cloudinary = require('cloudinary').v2
const morgan = require('morgan')

// Routers
const mainRouter = require('./routes/mainRouter')
const usersRouter = require('./routes/usersRouter')
const wingsRouter = require('./routes/wingsRouter')
const harnessRouter = require('./routes/harnessRouter')
const rescuesRouter = require('./routes/rescuesRouter')
const instrumentsRouter = require('./routes/instrumentsRouter')
const miscRouter = require('./routes/miscRouter')

//  Set up mongoose connection
const { DB_HOST, DB_PORT, DB_LOGIN, DB_PWD, DB_NAME } = process.env
mongoose.connect(`mongodb://${DB_LOGIN}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`)
const db = mongoose.connection
// Error connection to DB
db.on('error', (err) => {
  console.log('DB not connected ', err)
})
// Success connection to DB.
db.once('open', () => {
  console.log('🎊 Hoora! You are connected to the database')
})
app.listen(3000, () => {
  console.log('🚀 Server running on port 3000')
})

// Logger
app.use(morgan('dev'))

// Configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
})

// Parsing json/x-www-form-urlencoded
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize Passport
app.use(passport.initialize())
require('./auth/auth.js')(passport)

// Settings up routes
app.use('/', mainRouter)
app.use('/wings', wingsRouter)
app.use('/users', usersRouter)
app.use('/harness', harnessRouter)
app.use('/rescues', rescuesRouter)
app.use('/instruments', instrumentsRouter)
app.use('/misc', miscRouter)

// Handle errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.json({ error: err.message })
})
