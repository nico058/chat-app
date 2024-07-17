import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { BiPowerOff } from 'react-icons/bi'

export default function Logout() {
  const navigate = useNavigate()

  const handleClick = async () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <ButtonContainer>
      <Button onClick={handleClick}>
        <BiPowerOff />
      </Button>
    </ButtonContainer>
  )
}

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
`

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #f8f9fa;
  border: none;
  cursor: pointer;
  svg {
    color: #ff0000;
    font-size: 1.5rem;
  }
`
