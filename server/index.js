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
  .connect('mongodb://localhost:27017/webapp')
  .then(() => console.log('MongoDB connected!!'))
  .catch((err) => console.error('Error connecting to MongoDB :( :', err))

const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on PORT ${process.env.PORT}.`)
})

const io = socket(server, {
  cors: {
    origin: 'http://localhost:3000',
    credential: true,
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
      socket.to(sendUserSocket).emit('message-recive', data.message)
  })
})
