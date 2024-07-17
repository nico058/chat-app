import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import loader from '../asset/loader.gif'
import { setAvatarRoute } from '../utils/APIroutes'

export default function SetAvatar() {
  const api = 'https://api.multiavatar.com'
  const navigate = useNavigate()
  const [avatars, setAvatars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)

  const toastOption = {
    position: 'bottom-right',
    autoClose: 8000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  }

  useEffect(() => {
    const checkUser = async () => {
      const user = localStorage.getItem('chat-app-user')
      if (!user) {
        navigate('/login')
      }
    }
    checkUser()
  }, [navigate])

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const data = []
        for (let i = 0; i < 4; i++) {
          const image = await axios.get(
            `${api}/${Math.round(Math.random() * 1000)}`,
            { responseType: 'arraybuffer' }
          )

          const base64 = btoa(
            new Uint8Array(image.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )
          data.push(`data:image/svg+xml;base64,${base64}`)
          await new Promise((resolve) => setTimeout(resolve, 1000)) // Delay between requests
        }
        setAvatars(data)
        console.log('Avatars fetched:', data) // Log aggiunto
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching avatars:', error)
        setIsLoading(false)
      }
    }

    fetchAvatars()
  }, []) // Only run once on mount

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error('Please select an avatar before proceeding', toastOption)
      return
    }

    const user = JSON.parse(localStorage.getItem('chat-app-user'))
    try {
      const response = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      })

      if (response.data.isSet) {
        user.isAvatarImageSet = true
        user.avatarImage = response.data.image
        localStorage.setItem('chat-app-user', JSON.stringify(user))
        navigate('/chat')
      } else {
        toast.error(
          'Failed to set avatar. Please try again later.',
          toastOption
        )
      }
    } catch (error) {
      console.error('Error setting avatar:', error)
      toast.error('Failed to set avatar. Please try again later.', toastOption)
    }
  }

  const logout = async () => {
    localStorage.removeItem('chat-app-user')
    navigate('/login')
  }

  return (
    <>
      <Container>
        <div className="title-container">
          <h1>Pick an avatar as your profile picture</h1>
        </div>

        <div className="avatars">
          {avatars.map((avatar, index) => (
            <div
              key={index}
              className={`avatar ${selectedAvatar === index ? 'selected' : ''}`}
              onClick={() => setSelectedAvatar(index)}
            >
              <img src={avatar} alt="avatar" />
            </div>
          ))}
        </div>

        <StyledButton onClick={setProfilePicture}>
          Set as Profile Picture
        </StyledButton>

        <StyledButton onClick={logout}>Logout</StyledButton>

        {isLoading && <img className="loader" src={loader} alt="Loading..." />}
      </Container>

      <ToastContainer />
    </>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-width: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
      }

      &.selected {
        border-color: #007bff; /* Colore del bordo quando l'avatar è selezionato */
      }
    }
  }
`

const StyledButton = styled.button`
  background-color: #a83fd1; /* Lilla più scuro */
  color: white;
  font-size: 1.2rem;
  padding: 10px 20px; /* Padding per rendere il pulsante più rettangolare */
  border: none;
  border-radius: 5px; /* Bordo leggermente arrotondato */
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #8e2db0; /* Lilla ancora più scuro al passaggio del mouse */
  }
`
