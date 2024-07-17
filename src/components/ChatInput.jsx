import React, { useState } from 'react'
import styled from 'styled-components'
import Picker from 'emoji-picker-react'
import { BsEmojiSmileFill } from 'react-icons/bs'
import { GoPaperAirplane } from 'react-icons/go'

export default function ChatInput({ handleSendMessage }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [message, setMessage] = useState('')

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = (event, emojiObject) => {
    let emoji = event.emoji
    setMessage(message + emoji)
    setShowEmojiPicker(false)
  }

  const sendChat = (event) => {
    event.preventDefault()
    if (message.trim().length > 0) {
      handleSendMessage(message)
      setMessage('')
    }
  }

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
        </div>
      </div>
      <form className="input-container" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="type here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setShowEmojiPicker(false)}
        />
        <button type="submit" className="submit">
          <GoPaperAirplane />
        </button>
      </form>
      {showEmojiPicker && (
        <PickerContainer>
          <Picker onEmojiClick={handleEmojiClick} />
        </PickerContainer>
      )}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: #d1c4e9; /* Lilla scuro */
  padding: 0.1rem 0.3rem; /* Assottigliato il padding */
  border-radius: 1.5rem;
  margin: 0 1rem;

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0.1rem 0.3rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 0.5rem; /* Ridotto il gap */

    .emoji {
      svg {
        color: #9575cd;
        font-size: 1.5rem;
        cursor: pointer;
      }
    }
  }

  .input-container {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #ede7f6; /* Parte bianca */
    border-radius: 1.5rem;
    padding: 0.2rem 1rem; /* Ingrandito un po' il padding */
    margin-left: 0.5rem; /* Ridotto il margine sinistro */

    input {
      flex: 1;
      background-color: transparent;
      color: #4527a0;
      border: none;
      font-size: 1rem;
      height: 1.5rem; /* Ulteriormente ridotto l'altezza */
      &::selection {
        background-color: #d1c4e9;
      }
      &:focus {
        outline: none;
      }
    }

    button {
      padding: 0.1rem 0.5rem; /* Ulteriormente ridotto il padding */
      border-radius: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #7e57c2;
      border: none;

      svg {
        font-size: 1.5rem;
        color: white;
      }

      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.1rem 0.5rem;
        svg {
          font-size: 1rem;
        }
      }
    }
  }
`

const PickerContainer = styled.div`
  position: absolute;
  bottom: 60px;
  left: 0;
  z-index: 10;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`
