const express = require('express')
const path = require('path')

const router = express.Router()

const appRoutes = require(path.join(__dirname, 'appRoutes'))
const authRoutes = require(path.join(__dirname, 'authRoutes'))
router.use('/', appRoutes)
router.use('/', authRoutes)

const accountRoutes = require(path.join(__dirname, 'accountRoutes'))
router.use('/api', accountRoutes)

module.exports = router
