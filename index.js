const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')


const app = express()

var port = process.env.PORT || 5000


app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/', require('./routes/index'))


app.use((req, res) => {
    res.status(404).send({url: req.originalUrl + "Not found"})
})

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://kiyara:kiyara35@cluster0.pycsu.mongodb.net/auth_users', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(port)

    } catch (e) {
        console.log(e)
    }
}
start()