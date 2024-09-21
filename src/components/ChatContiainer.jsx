import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ChatInput from './ChatInput'
import axios from 'axios'
import { getAllMessageRoute, sendMessageRoute } from '../utils/APIroutes'

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [showHelpMessage, setShowHelpMessage] = useState(false)
  const scrollRef = useRef()

  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(getAllMessageRoute, {
          from: currentUser._id,
          to: currentChat._id,
        })
        setMessages(response.data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }
    fetchMessages() // Chiamata alla funzione fetchMessages al montaggio del componente
  }, [currentChat, currentUser._id])

  const handleSendMessage = async (msg) => {
    try {
      socket.current.emit('send-message', {
        to: currentChat._id,
        from: currentUser._id,
        message: msg,
      })
      await axios.post(sendMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: msg,
      })
    } catch (error) {
      console.error('Error sending message:', error)
    }
    const msgs = [...messages]
    msgs.push({ fromSelf: true, message: msg })
    setMessages(msgs)
  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on('msg-recieve', (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg })
      })
    }
  }, [socket])
  //Quando il valore di socket cambia (ad esempio, viene inizializzato o modificato), l'effetto viene rieseguito.

  useEffect(() => {
    if (socket.current)
      socket.current.on('message-recieve', (message) => {
        setArrivalMessage({ fromSelf: false, message: message })
      })
  }, [socket])

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Funzione di utilità per garantire che l'URL base64 sia corretto
  const getAvatarUrl = (avatarImage) => {
    if (avatarImage && avatarImage.startsWith('data:image/svg+xml;base64,')) {
      return avatarImage
    }
    return `data:image/svg+xml;base64,${avatarImage}`
  }

  // Funzione per gestire la visualizzazione del messaggio di aiuto
  const toggleHelpMessage = () => {
    setShowHelpMessage(true)
    setTimeout(() => {
      setShowHelpMessage(false)
    }, 5000) 
  }

  return (
    <>
      {currentChat && (
        <Container>
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img src={getAvatarUrl(currentChat.avatarImage)} alt="avatar" />
              </div>
              <div className="username">
                <h3>{currentChat.username}</h3>
              </div>
            </div>
            <hr />
            <div className="help-link">
              <span className="help-icon" onClick={toggleHelpMessage}>
                ?
              </span>
            </div>
          </div>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${
                  message.fromSelf ? 'sended' : 'received'
                }`}
              >
                <div className="content">
                  <p>{message.message}</p>
                </div>
              </div>
            ))}
            <div ref={scrollRef}></div>
          </div>
          {showHelpMessage && (
            <HelpMessage>
              Se si riscontrano problemi scrivere a gruppoA@gmail.com
            </HelpMessage>
          )}
          <ChatInput handleSendMessage={handleSendMessage} />
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
  display: grid;
  padding-top: 1rem;
  grid-template-rows: 10% 78% 12%;
  gap: 0.1rem;
  overflow: hidden;
  height: 100%;
  background-color: #f3e5f5; /* Lilla chiaro */
  position: relative;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }

  .chat-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 2rem;
    position: relative;
    background-color: #d1c4e9; /* Lilla scuro */

    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;

      .avatar {
        img {
          height: 3rem;
        }
      }

      .username {
        h3 {
          color: #4527a0; /* Lilla più scuro */
        }
      }
    }

    hr {
      margin: 0.5rem 0;
      width: 100%;
      border: none;
      border-top: 1px solid #d1c4e9; /* Cambiato per far combaciare con lo sfondo */
    }

    .help-link {
      position: absolute;
      top: 1rem;
      right: 2rem;

      .help-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 2rem;
        height: 2rem;
        background-color: #ab47bc; /* Viola */
        color: white;
        border-radius: 50%;
        text-decoration: none;
        font-size: 1.5rem;
        font-weight: bold;
        cursor: pointer; /* Aggiunto il cursore puntatore */
        transition: background-color 0.3s ease;

        &:hover {
          background-color: #8e24aa; /* Viola scuro */
        }
      }
    }
  }

  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    background-color: #f3e5f5; /* Lilla chiaro */

    &::-webkit-scrollbar {
      width: 8px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #ba68c8; /* Lilla */
      border-radius: 1rem;
    }
  }

  .message {
    display: flex;
    align-items: center;

    .content {
      max-width: 80%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #4527a0; /* Lilla più scuro */
      background-color: #d1c4e9; /* Lilla scuro */

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
    }
  }

  .sended {
    justify-content: flex-end;

    .content {
      background-color: #9575cd; /* Lilla medio */
    }
  }

  .received {
    justify-content: flex-start;

    .content {
      background-color: #b39ddb; /* Lilla chiaro */
    }
  }

  .chat-input {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    background-color: #d1c4e9; /* Lilla scuro */
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    position: relative;
    z-index: 1; /* Portare ChatInput sopra il banner di aiuto */
  }

  .chat-input textarea {
    flex: 1;
    height: 4rem; /* Aumentata l'altezza */
    padding: 1rem; /* Aumentato il padding */
    border: none;
    resize: none;
    font-size: 1.2rem; /* Aumentato il font-size */
    border-radius: 0.5rem;
    outline: none;
  }
`

const HelpMessage = styled.div`
  background-color: #7e57c2; /* Lilla scuro */
  color: white;
  padding: 1rem 2rem; /* Aumentato il padding per renderlo più alto */
  border-radius: 1rem; /* Maggiore border-radius per renderlo più arrotondato */
  text-align: center;
  font-size: 1rem; /* Aumentato il font-size */
  width: 50%; /* Ridotta la larghezza per renderlo più stretto */
  position: absolute;
  bottom: 6rem; /* Posizionato sopra la chat-input */
  left: 50%;
  transform: translateX(-50%);
  z-index: 2; /* Portare il banner sopra ChatInput */
  overflow: auto;
`
