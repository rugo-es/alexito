const express = require('express')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

const accountController = require('../controllers/accountController')
const authMiddleware = require('../middleware/authenticate')

const router = express.Router()

router.get('/account', accountController.getAll)
router.get('/account/:id', accountController.getById)
router.post('/account', accountController.create)
router.put('/account/:id', authMiddleware.ensureAuth, accountController.update)
router.delete('/account/:id', accountController.destroy)
router.post('/account/uploadAvatar', upload.single('avatar'), accountController.uploadAvatar)

module.exports = router
