require('dotenv').config()
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const model = require('./model')
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('dist'))

app.listen(PORT, () => console.log(`Server running on ${PORT}`))

app.get('/ep/:id?', (req, res) => {
    let id = req.params.id
    if (id) {
        model.findOne({ episode: id }, (err, item) => {
            if (err) {
                res.json(err)
            } else {
                res.json(item)
            }
        })
    } else {
        model.findOne().sort({ 'episode': 'desc' }).exec((err, item) => {
            if (err) {
                res.json(err)
            } else {
                res.json(item)
            }
        })
    }
})

app.get('/list', (req, res) => {
    model.find().select('episode').sort({ 'episode': 'desc' }).exec((err, item) => {
        if (err) {
            res.json(err)
        } else {
            res.json(item)
        }
    })
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/dist/index.html'))
})