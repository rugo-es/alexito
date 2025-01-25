const express = require('express')
const path = require('path')

const router = express.Router()

const appRoutes = require(path.join(__dirname, 'appRoutes'))
const authRoutes = require(path.join(__dirname, 'authRoutes'))
router.use('/', appRoutes)
router.use('/', authRoutes)

const accountRoutes = require(path.join(__dirname, 'accountRoutes'))
const messageRoutes = require(path.join(__dirname, 'messageRoutes'))
router.use('/api', accountRoutes)
router.use('/api', messageRoutes)

module.exports = router
