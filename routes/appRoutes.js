const express = require('express')
const appController = require('../controllers/appController')

const authMiddleware = require('../middleware/authenticate')

const router = express.Router()

router.get('/', authMiddleware.ensureAuth, appController.landing)
router.get('/login', appController.login)
router.get('/register', appController.register)
router.get('/profile', authMiddleware.ensureAuth, appController.profile)
router.get('/chat', authMiddleware.ensureAuth, appController.chat)
router.get('/faqs', authMiddleware.ensureAuth, appController.faqs)

module.exports = router
