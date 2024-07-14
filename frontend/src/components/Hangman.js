import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Hangman = () => {
  const [maskedWord, setMaskedWord] = useState('')
  const [guess, setGuess] = useState('')
  const [incorrectGuesses, setIncorrectGuesses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch('http://localhost:4000/hangman', {
          method: 'GET',
          credentials: 'include'
        })
        const data = await response.json()

        if(response.status === 501){
          window.alert("Please login first!")
          navigate("/login")
        }

        setMaskedWord(data.maskedWord)
      } catch (err) {
        console.error('Error fetching game:', err)
      }
    }

    fetchGame()
  }, [])

  const handleGuess = async () => {
    try {
      const response = await fetch('http://localhost:4000/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ guess })
      })

      const data = await response.json()

      if(response.status === 501){
        window.alert("Please login first!")
        navigate("/login")
      }

      if (response.ok){
        setMaskedWord(data.maskedWord)
        setIncorrectGuesses(data.incorrectGuesses)
      }
      if(response.status === 400){
        window.alert("Invalid Entry, please enter in a letter")
      }
      if (!data.maskedWord.includes('_')) {
        navigate('/scores');
      }
    } catch (err) {
      console.error('Error making guess:', err)
    }
    setGuess("")
  };
  return (
    <div>
      <h1>Hangman Game</h1>
      <p>The word to guess is: {maskedWord}</p>
      <input
        type='text'
        value={guess}
        onChange={e => setGuess(e.target.value)}
        maxLength='1'
      />
      <button onClick={handleGuess}>Guess</button>
      <p>Incorrect Guesses: {incorrectGuesses.join(', ')}</p>
    </div>
  )
}
export default Hangman
