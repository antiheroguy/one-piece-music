require('dotenv').config()
const mongoose = require('mongoose')
const DB = process.env.DB || 'mongodb://localhost:27017/one-piece'

mongoose.connect(DB, { useNewUrlParser: true })

const model = mongoose.model('track', {
  episode: Number,
  titles: {
    en: String,
    ja: String
  },
  release: String,
  stamps: [{
    time: String,
    song: {
      id: Number,
      titles: {
        en: String,
        ja: String
      },
      time: String,
      time_seconds: Number,
      track: Number
    },
    album: {
      titles: {
        en: String,
        ja: String
      },
      release: String
    }
  }]
})

const page = mongoose.model('page', {
  number: Number
})

module.exports = {
  mongoose,
  model,
  page
}