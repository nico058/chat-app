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
    setMessage(message + event.emoji)
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
          placeholder="Type a message"
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
  background-color: #b39ddb; /* Lilla chiaro */
  padding: 1rem;
  border-radius: 0.7rem;
  width: 95%; /* Ridotta la larghezza */
  margin: 0 auto 1rem auto; /* Aggiunti margini automatici per centrare */

  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 1rem;
    gap: 1rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;

    .emoji {
      svg {
        color: #f1c40f; /* Giallo dell'emoji */
        font-size: 1.5rem;
        cursor: pointer;
      }
    }
  }

  .input-container {
    display: flex;
    align-items: center;
    background-color: #9575cd; /* Lilla medio */
    border-radius: 25rem;
    padding: 0.3rem 1rem;
    margin-left: 1rem;
    width: 100%;

    input {
      flex: 1;
      background-color: transparent;
      color: white;
      border: none;
      font-size: 1.2rem;

      &::selection {
        background-color: #9575cd; /* Lilla medio */
      }
      &:focus {
        outline: none;
      }

      /* Stili per il placeholder */
      &::placeholder {
        color: #d1c4e9; /* Lilla chiaro */
        opacity: 1; /* Per garantire che il colore sia visibile */
      }
    }

    button {
      padding: 0.3rem 1rem;
      border-radius: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #673ab7; /* Viola medio */
      border: none;
      svg {
        font-size: 1.5rem;
        color: white;
      }
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 0.7rem;
        svg {
          font-size: 1rem;
        }
      }
    }
  }
`

const PickerContainer = styled.div`
  position: absolute;
  bottom: 60px; /* Altezza dal basso verso l'alto */
  left: 0;
  z-index: 10;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`
