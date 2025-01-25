const express = require('express')

const messageController = require('../controllers/messageController')
const authMiddleware = require('../middleware/authenticate')

const router = express.Router()

router.get('/message', messageController.getAll)
router.get('/message/:id', messageController.getById)
router.post('/message', messageController.create)
router.put('/message/:id', authMiddleware.ensureAuth, messageController.update)
router.delete('/message/:id', messageController.destroy)

router.get('/chat/:accountId', messageController.getChatsByAccount)
router.put('/chat/markMessagesAsRead', messageController.markMessagesAsRead)

module.exports = router
