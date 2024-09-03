const jwt = require('jsonwebtoken')
// const moment = require('moment')

function ensureAuth (req, res, next) {
  const token = req.cookies.access_token
  if (!token && req.route.path !== '/') {
    return res.redirect('/login')
  }
  req.session = { account: null }
  try {
    const publicAccount = jwt.verify(token, process.env.SECRET_JWT_KEY)
    req.session.account = publicAccount
    next()
  } catch (error) {
    if (req.route.path !== '/') {
      return res.redirect('/login')
    }
    next()
  }
}

module.exports = {
  ensureAuth
}
