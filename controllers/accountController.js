const bcrypt = require('bcrypt')
const path = require('path')
const cloudinary = require('cloudinary').v2
// eslint-disable-next-line no-unused-vars
const cloudinaryConfig = require(path.join(__dirname, '../config/cloudinary'))

const Account = require(path.join(__dirname, '../models/account'))
const { validateRegisterForm } = require(path.join(__dirname, '../helpers/validations'))

async function getAll (req, res) {
  const accounts = await Account.find()
  return res.json(accounts)
}

async function getById (req, res) {
  const account = await Account.findById(req.params.id)
  return res.json(account)
}

async function create (req, res) {
  const { name, lastName, username, email, password, avatar, zone } = req.body
  const errors = await validateRegisterForm(req.body)
  if (errors.length > 0) {
    return res.json({ error: true, data: errors })
  }
  const hashedPassword = bcrypt.hashSync(password, 10)
  const account = new Account({ name, lastName, username, email, password: hashedPassword, avatar, zone })
  await account.save().catch(() => {
    return res.status(500).json({ error: true, message: 'Internal server error' })
  })
  return res.json(account)
}

async function update (req, res) {
  const account = req.session.account
  const { username } = req.body
  const errors = []
  const usernameExist = await Account.findOne().where({ username }).exec()
  if (usernameExist && username !== account.username) errors.push({ field: 'username', message: 'Nombre de usuario ya registrado' })
  if (!username) errors.push({ field: 'username', message: 'Introduce el nombre de usuario' })
  if (errors.length > 0) {
    return res.json({ error: true, data: errors })
  }
  const accountData = {
    name: req.body.name,
    lastName: req.body.lastName,
    username: req.body.username,
    avatar: req.body.avatar,
    zone: req.body.zone
  }
  if (req.body.password) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
    accountData.password = hashedPassword
  }
  const accountUpdated = await Account.findByIdAndUpdate(req.params.id, accountData, { new: true })
  return res.json(accountUpdated)
}

async function destroy (req, res) {
  await Account.findByIdAndDelete(req.params.id)
  return res.json({ error: false, message: 'Cuenta eliminada' })
}

async function uploadAvatar (req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
    if (error) {
      return res.status(500).json({ error: 'Error uploading to Cloudinary' })
    }
    const url = cloudinary.url(result.display_name, {
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'center' }
      ]
    })
    res.status(200).send({ error: false, url })
  }).end(req.file.buffer)
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  destroy,
  uploadAvatar
}
