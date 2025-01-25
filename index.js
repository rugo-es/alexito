require('dotenv').config()
const { createServer } = require('node:http')
const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path') // const { join } = require('node:path');
const { Server } = require('socket.io')

const Message = require(path.join(__dirname, './models/message'))

// eslint-disable-next-line no-unused-vars
const db = require(path.join(__dirname, 'config/db.js'))

const app = express()
const server = createServer(app)
const io = new Server(server)
const port = 3001

const users = {}
io.on('connection', (socket) => {
  socket.on('register', async (userId) => {
    users[userId] = socket.id
    socket.username = userId
    console.log('register', `${userId} registrado con id ${socket.id}`)
    console.log('register', users)
    const unreadMessages = await Message.find({ to: userId, readed: false })
    if (unreadMessages.length > 0) {
      io.to(socket.id).emit('unread_messages')
    }
  })

  socket.on('private_message', async ({ from, to, message }) => {
    const newMessage = new Message({ from, to, message })
    const newMessageData = await newMessage.save()
    const destinySocketId = users[to]
    if (destinySocketId) {
      io.to(destinySocketId).emit('private_message', newMessageData)
    } else {
      // socket.emit('user_not_connected', { to })
    }
  })

  socket.on('disconnect', () => {
    console.log(`${socket.username} desconectado`)
    delete users[socket.username]
  })
})

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.engine('html', mustacheExpress())
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'))
app.set('partials', path.join(__dirname, 'views/partials'))

app.use('/img', express.static(path.join(__dirname, 'assets/img')))
app.use('/css', express.static(path.join(__dirname, 'assets/css')))
app.use('/js', express.static(path.join(__dirname, 'assets/js')))
app.use('/sound', express.static(path.join(__dirname, 'assets/sound')))
app.use('/vendor', express.static(path.join(__dirname, 'assets/vendor')))

const routes = require(path.join(__dirname, 'routes/mainRoutes'))
app.use('/', routes)

server.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
})
