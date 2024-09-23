const messageModel = require('../model/messageModel')
const util = require('util')

// Invio messaggi
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body
    const data = await messageModel.create({
      message: message,
      users: [from, to],
      sender: from,
    })
    console.log(data)
    if (data) return res.json({ message: 'Messaggio inviato con successo.' })
    return res.json({ message: 'Impossibile inviare il messaggio.' })
  } catch (ex) {
    next(ex)
  }
}

// Ricevo messaggi
module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body // Utilizzo req.query per ottenere i parametri dalla query string

    const messages = await messageModel
      .find({
        users: { $all: [from, to] },
      })
      .sort({ updatedAt: 1 }) // Ordina i messaggi per data di aggiornamento ascendente

    const formattedMessages = messages.map((message) => ({
      fromSelf: message.sender.toString() === from,
      message: message.message, // Accedo direttamente a message.message, assumendo che il campo sia correttamente definito nel modello
    }))

    return res.json(formattedMessages)
  } catch (ex) {
    next(ex)
  }
} 
