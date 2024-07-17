import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Robot from '../asset/robot.gif'

export default function Welcome() {
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const fetchUserName = async () => {
      const storedData = localStorage.getItem('chat-app-user')
      if (storedData) {
        const data = JSON.parse(storedData)
        setUserName(data.username)
      }
    }
    fetchUserName()
  }, [])

  return (
    <Container>
      <img src={Robot} alt="Robot" />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #4527a0;
  flex-direction: column;
  background-color: #ede7f6;
  height: 90vh;

  img {
    height: 20rem;
  }
  h1 {
    span {
      color: #7e57c2;
    }
  }
`
