import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Logo from '../asset/logo.svg'
import Logout from './Logout'

export default function Contacts({ contacts, currentUser, changeChat }) {
  const [currentUserName, setCurrentUserName] = useState(undefined)
  const [currentUserImage, setCurrentUserImage] = useState(undefined)
  const [currentSelected, setCurrentSelected] = useState(undefined)

  useEffect(() => {
    if (currentUser) {
      setCurrentUserImage(currentUser.avatarImage)
      setCurrentUserName(currentUser.username)
    }
  }, [currentUser])

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index)
    changeChat(contact)
  }

  const getAvatarUrl = (avatarImage) => {
    if (avatarImage && avatarImage.startsWith('data:image/svg+xml;base64,')) {
      return avatarImage
    }
    return `data:image/svg+xml;base64,${avatarImage}`
  }

  return (
    <>
      {currentUserImage && currentUserName && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>RT-chat</h3>
          </div>
          <div className="contacts">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className={`contact ${
                  index === currentSelected ? 'selected' : ''
                }`}
                onClick={() => changeCurrentChat(index, contact)}
              >
                <div className="avatar">
                  <img src={getAvatarUrl(contact.avatarImage)} alt="avatar" />
                </div>
                <div className="username">
                  <h3>{contact.username}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="current-user">
            <div className="avatar">
              <img src={getAvatarUrl(currentUserImage)} alt="avatar" />
            </div>
            <div className="username">
              <h1>{currentUserName}</h1>
            </div>
            <div className="logout-button">
              <Logout />
            </div>
          </div>
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #ede7f6;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: #4527a0;
      text-transform: uppercase;
    }
  }

  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ba68c8;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #d1c4e9;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.5rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: #4527a0;
        }
      }
    }
    .selected {
      background-color: #7e57c2;
    }
  }

  .current-user {
    background-color: #d1c4e9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    border-radius: 1rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      flex-grow: 1;
      text-align: center;
      h1 {
        color: #4527a0;
      }
    }
    .logout-button {
      button {
        background-color: #ab47bc;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
        transition: background-color 0.3s ease;
      }
      button:hover {
        background-color: #8e24aa;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      .username {
        h1 {
          font-size: 1rem;
        }
      }
    }
  }
`
