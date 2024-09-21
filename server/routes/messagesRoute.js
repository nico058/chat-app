const { addMessage, getAllMessage, deleteMessage } = require('../controls/messagesController')

const {} = require('../controls/userController')
const router = require('express').Router()

router.post('/addmessage/', addMessage)
router.post('/getmessage/', getAllMessage)
router.delete('/deletemessage', deleteMessage)

module.exports = router
