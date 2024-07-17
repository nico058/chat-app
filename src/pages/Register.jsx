import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link, useNavigate } from 'react-router-dom'
import Logo from '../asset/logo.svg'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { registerRoute } from '../utils/APIroutes'

function Register() {
  const navigate = useNavigate()
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      console.log('Inizio validazione', registerRoute)
      const { username, email, password } = values
      try {
        const { data } = await axios.post(registerRoute, {
          username,
          email,
          password,
        })
        console.log('Risposta dal server:', data)
        if (data.status === false) {
          toast.error(data.message, toastOption)
        }
        if (data.status === true) {
          localStorage.setItem('chat-app-user', JSON.stringify(data.user))
        }
      } catch (error) {
        console.error('Errore durante la richiesta:', error)
        toast.error(
          'Errore durante la registrazione. Sei gia registrato? Accedi',
          toastOption
        )
      }
      navigate('/chat')
    }
  }

  const handleValidation = () => {
    const { password, confirmPassword, email, username } = values
    if (password !== confirmPassword) {
      toast.error(
        'Password and confirm password must be the same.',
        toastOption
      )
      return false
    } else if (username.length < 4) {
      toast.error(' Username should be grater thant 4 letters', toastOption)
      return false
    } else if (password.length < 6) {
      toast.error(
        ' Password should be equal or grater thant 6 letters',
        toastOption
      )
      return false
    } else if (email === '') {
      toast.error('email is required ', toastOption)
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
            <h1>RT-chat</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
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
  background-color: #b39ddb; /* Lilla medio */

  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;

    img {
      height: 5rem;
    }

    h1 {
      color: #e0e0e0; /* Grigio chiaro */
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #d1c4e9; /* Lilla chiaro */
    border-radius: 2rem;
    padding: 3rem 5rem;
  }

  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #9575cd; /* Lilla medio */
    border-radius: 0.4rem;
    color: #e0e0e0; /* Grigio chiaro */
    width: 100%;
    font-size: 1rem;

    &:focus {
      border: 0.1rem solid #b39ddb; /* Lilla chiaro */
      outline: none;
    }
  }

  button {
    background-color: #b39ddb; /* Lilla chiaro */
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #9575cd; /* Lilla medio */
    }
  }

  span {
    color: white;
    text-transform: uppercase;

    a {
      color: #9575cd; /* Lilla medio */
      text-decoration: none;
      font-weight: bold;
    }
  }
`

export default Register
