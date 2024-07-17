const { addMessage, getAllMessage } = require('../controls/messagesController')

const {} = require('../controls/userController')
const router = require('express').Router()

router.post('/addmessage/', addMessage)
router.post('/getmessage/', getAllMessage)

module.exports = router
