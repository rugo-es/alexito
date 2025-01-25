const mongoose = require('mongoose')

const getSpainDate = () => {
  const now = new Date()
  return new Date(now.getTime() + 60 * 60 * 1000)
}

const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  message: String,
  readed: { type: Boolean, default: false },
  datetime: {
    type: Date,
    default: () => getSpainDate()
  }
})

module.exports = mongoose.model('Message', messageSchema)
