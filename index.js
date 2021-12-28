const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const PORT = process.env.port || 5050
const cors = require('cors')


const app = express()
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
        app.listen(PORT, () => {
            console.log(`server started on port:${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}
start()