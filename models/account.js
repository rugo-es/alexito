const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  username: String,
  email: String,
  password: String,
  avatar: String,
  zone: Object
}, {
  query: {
    byEmail (email) {
      return this.where({ email })
    }
  }
})

module.exports = mongoose.model('Account', accountSchema)
