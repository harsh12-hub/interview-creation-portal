require('dotenv').config()

const express = require('express')
const app = express()
const fs = require('fs')
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Mongoose connected'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/views'))

app.get('/', (req, res) => {
    res.render('index')
})

const interviewsRouter = require('./routes/interviews')
const studentsRouter = require('./routes/students')

app.use('/interviews', interviewsRouter)
app.use('/students', studentsRouter)

app.listen(3000, () => console.log('Listening on port 3000'))