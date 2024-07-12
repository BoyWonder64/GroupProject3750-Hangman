import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login () {
  const [form, setForm] = useState({
    username: ''
  })

  const navigate = useNavigate()

  const updateForm = e => {
    const { name, value } = e.target
    setForm(prevForm => ({ ...prevForm, [name]: value }))
  }

  const onSubmit = async e => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      })

      if (response.ok) {
        navigate('/hangman')
      } else {
        window.alert('An error occurred during the login process...')
        setForm({ username: '' }) //clear
      }
    } catch (error) {
      window.alert('An error occurred: ' + error)
    }
  }

  return (
    <div>
      <h2>Welcome to Hangman!</h2>
      <h3>Please enter your username</h3>
      <form onSubmit={onSubmit}>
        <div>
          <label>Username: </label>
          <input
            type='text'
            name='username'
            value={form.username}
            onChange={updateForm}
          />
        </div>
        <br />
        <input type='submit' value='Lets Play' />
      </form>
    </div>
  )
}
