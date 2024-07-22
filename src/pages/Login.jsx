import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../asset/logo-final.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { loginRoute } from '../utils/APIroutes'

function Login() {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
  })

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
    if (localStorage.getItem('chat-app-user')) {
      navigate('/chat')
    }
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (handleValidation()) {
      console.log('Start Validation', loginRoute)
      const { username, password } = values
      try {
        const { data } = await axios.post(loginRoute, {
          username,
          password,
        })
        console.log('Reply from server:', data)
        if (data.status === false) {
          toast.error(data.message, toastOption)
        }
        if (data.status === true) {
          localStorage.setItem('chat-app-user', JSON.stringify(data.user))
          navigate('/chat')
        }
      } catch (error) {
        console.error('Error during the request:', error)
        toast.error(
          'Error during the registration. Do you already have an account? Sign in now.',
          toastOption
        )
      }
    }
  }

  const handleValidation = () => {
    const { password, username } = values
    if (password === '' || username === '') {
      toast.error('Username and password are required', toastOption)
      return false
    }
    return true
  }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>TEXTIFY</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Login in</button>
          <span>
            Don't have an account? <Link to="../register">Get it now!</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #b39ddb;

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 4.5rem;
      border-radius: 4rem;
    }

    h1 {
      color: #4527a0;
      text-transform: uppercase;
      font-size: 3.5rem;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #d1c4e9;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #9575cd;
    border-radius: 0.4rem;
    color: black;
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #b39ddb;
      outline: none;
    }
  }

  button {
    background-color: #b39ddb;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #9575cd;
    }
  }

  span {
    color: white;
    text-transform: uppercase;

    a {
      color: #9575cd;
      text-decoration: none;
      font-weight: bold;
    }
  }
`

export default Login
