const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const messagesRoute = require('./routes/messagesRoute')
//controllare se ci vuole messages o message
const socket = require('socket.io')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', userRoutes)
app.use('/api/messages', messagesRoute)



mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected!!'))
  .catch((err) => console.error('Error connecting to MongoDB :( :', err))

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT ${process.env.PORT}.`)
})

// Aggiungi questo per abilitare CORS
app.use(cors({
  origin: 'http://localhost:3000', // Consenti solo il front-end a localhost:3000
  methods: ['GET', 'POST', 'PUT'], // Definisci i metodi HTTP permessi
  credentials: true // Se hai bisogno di inviare cookie o credenziali
}));

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})

global.onlineUsers = new Map()

io.on('connection', (socket) => {
  global.chatSocket = socket
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id)
  })

  socket.on('sending-message', (data) => {
    const sendUserSocket = onlineUsers.get(data.io)
    if (sendUserSocket)
      socket.to(sendUserSocket).emit('message-receive', data.message)
  })
})
