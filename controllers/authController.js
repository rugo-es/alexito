const bcrypt = require('bcrypt')
const path = require('path')
const jwt = require('jsonwebtoken')

const Account = require(path.join(__dirname, '../models/account'))
const { validateLoginForm } = require(path.join(__dirname, '../helpers/validations'))

async function login (req, res) {
  const { email, password } = req.body
  const errors = await validateLoginForm(req.body)
  if (errors.length > 0) {
    return res.json({ error: true, data: errors })
  }
  const account = await Account.findOne().byEmail(email.trim()).exec()
  if (!account) {
    return res.json({ message: 'Error login' })
  }
  bcrypt.compare(password, account.password, (err, check) => {
    if (!check || err) {
      return res.status(401).send({ error: true, message: 'Unauthorized' })
    }
    const publicAccount = {
      _id: account._id,
      name: account.name,
      lastName: account.lastName,
      username: account.username,
      email: account.email,
      avatar: account.avatar,
      zone: account.zone
    }
    const token = jwt.sign(publicAccount, process.env.SECRET_JWT_KEY, { expiresIn: '3h' })
    return res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    }).json({
      token,
      publicAccount
    })
  })
}

async function updateToken (req, res) {
  const account = await Account.findById(req.params.id)
  const publicAccount = {
    _id: account._id,
    name: account.name,
    lastName: account.lastName,
    username: account.username,
    email: account.email,
    avatar: account.avatar,
    zone: account.zone
  }
  const token = jwt.sign(publicAccount, process.env.SECRET_JWT_KEY, { expiresIn: '3h' })
  return res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }).json({
    token
  })
}

async function logout (req, res) {
  res.clearCookie('access_token').redirect('/')
}

module.exports = {
  login,
  updateToken,
  logout
}
