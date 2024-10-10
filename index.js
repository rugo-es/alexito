require('dotenv').config()
const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path') // const { join } = require('node:path');

// eslint-disable-next-line no-unused-vars
const db = require(path.join(__dirname, 'config/db.js'))

const app = express()
const port = 3000

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
app.use('/vendor', express.static(path.join(__dirname, 'assets/vendor')))

const routes = require(path.join(__dirname, 'routes/mainRoutes'))
app.use('/', routes)

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
})
