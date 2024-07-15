import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Hangman = () => {
  const [maskedWord, setMaskedWord] = useState('')
  const [guess, setGuess] = useState('')
  const [incorrectGuesses, setIncorrectGuesses] = useState([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/hangman', {
          method: 'GET',
          credentials: 'include'
        })
        const data = await response.json()
        setMaskedWord(data.maskedWord)
      } catch (err) {
        console.error('Error fetching game:', err)
      }
    }

    fetchGame()
  }, [])

  const handleGuess = async () => {
    // Prevents "empty"/space/number guesses
    if (!guess || guess == ' ' || !/^[a-zA-Z]$/.test(guess)) {
      setMessage('Please enter a valid letter')
      return
    }

    try {
      const response = await fetch('http://localhost:4000/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ guess })
      })
      const data = await response.json()
      if (response.ok) {
        setMaskedWord(data.maskedWord)
        setIncorrectGuesses(data.incorrectGuesses)
        setGuess('')

        if (data.gameOver) {
          sessionStorage.setItem('wordLength', data.word.length)
          navigate('/scores', { state: { word: data.word, won: data.won } })
          return
        }

        setMessage(data.message || '')
      } else {
        setMessage(data.error || 'An error occurred while making a guess.')
      }
    } catch (err) {
      console.error('Error making guess:', err)
      setMessage('An error occurred while making a guess.')
    }
  }
  return (
    <div>
      <h1>Hangman Game</h1>
      <p>{maskedWord}</p>
      <input
        type='text'
        value={guess}
        onChange={e => setGuess(e.target.value)}
        maxLength='1'
      />
      <button onClick={handleGuess}>Guess</button>
      <p>incorrect Guesses: {incorrectGuesses.join(', ')}</p>
      {message && <p>{message}</p>}
    </div>
  )
}
export default Hangman
