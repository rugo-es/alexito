const path = require('path')

const Message = require(path.join(__dirname, '../models/message'))
const Account = require(path.join(__dirname, '../models/account'))

async function getAll (req, res) {
  const messages = await Message.find()
  return res.json(messages)
}

async function getById (req, res) {
  return res.json({ endPoint: 'getById' })
  /*
  const account = await Account.findById(req.params.id)
  return res.json(account)
  */
}

async function create (req, res) {
  return res.json({ endPoint: 'create' })
  /*
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
  */
}

async function update (req, res) {
  return res.json({ endPoint: 'update' })
  /*
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
  */
}

async function destroy (req, res) {
  return res.json({ endPoint: 'destroy' })
  /*
  await Account.findByIdAndDelete(req.params.id)
  return res.json({ error: false, message: 'Cuenta eliminada' })
  */
}

async function markMessagesAsRead (req, res) {
  const { from, to } = req.body
  await Message.updateMany({ from, to }, { readed: true })
  res.json({ message: 'Data updated.' })
}

async function getChatsByAccount (req, res) {
  const { accountId } = req.params
  const messages = await Message.find({ $or: [{ from: accountId }, { to: accountId }] })
  if (!messages) return res.json(messages)
  const accountIds = new Set()
  messages.forEach(message => {
    accountIds.add(message.from)
    accountIds.add(message.to)
  })
  accountIds.delete(accountId)
  const dataContacts = await Account.find({ _id: { $in: [...accountIds] } })
  const contacts = dataContacts.map(account => {
    const { _id, username, avatar, zone } = account
    const unreadMessages = messages.filter(message => message.from === _id.valueOf() && message.readed === false).length
    const lastMessage = messages.filter(message => message.from === _id.valueOf() || message.to === _id.valueOf()).sort((a, b) => b.datetime - a.datetime)[0]
    return { _id: _id.valueOf(), username, avatar, zone, unreadMessages, lastMessage }
  })
  return res.json({ contacts, messages })
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  destroy,
  getChatsByAccount,
  markMessagesAsRead
}
