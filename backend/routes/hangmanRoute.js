const express = require('express')
const recordRoutes = express.Router()
const dbo = require('../db/conn')
const path = require('path')
//Used to read in file
const fs = require('fs')
const wordsFilePath = path.join(__dirname, '../words.csv')

// Set max for incorrect guesses
const maxIncorrectGuesses = 6

// This is the backend for the game screen. The majority of the game logic will happen here
recordRoutes.get('/hangman', async (req, res) => {
  try {
    let wordList
    const dbConnect = dbo.getDb()

    // Shortened csv file reading
    const data = await fs.promises.readFile(wordsFilePath, 'utf8');
    wordList = data.split('\n').map((word) => word.trim());
    console.log('Successfully loaded CSV File: ', wordList);

    const randomIndex = Math.floor(Math.random() * 1000) + 1 //randomly picks a number between 1 and 1000
    const chosenWord = wordList[randomIndex] //set the word based off of the index

    let maskedWord = '_ '.repeat(chosenWord.length).trim() // Mask all letters with underscores

    console.log(chosenWord)

// >>>>>>> fd0b784ad7b0fdc2b87b4cfd216d3e8bfa0b64dd
    // generate sessions for values
    req.session.word = chosenWord
    req.session.maskedWord = maskedWord
    req.session.guesses = []
    req.session.totalGuesses = 0

    res.json({ maskedWord })
  } catch (err) {
    console.error('Error fetching message:', err)
    res.status(500).json({ error: 'Failed to fetch message' })
  }
})

recordRoutes.post('/guess', async (req, res) => {
    try {
      const { guess } = req.body
      const dbConnect = dbo.getDb()
      const word = req.session.word
      let maskedWord = req.session.maskedWord
      let incorrectGuesses = req.session.incorrectGuesses
      let message = ''

      // Check if guess is already in  incorrectGuesses
      if (incorrectGuesses.includes(guess)) {
        return res.status(400).json({ error: 'Letter already guessed', maskedWord, incorrectGuesses })
      }

      // Check if the guess is in word
      if (word.includes(guess)) {
        // Update the masked word with the correct guess
        maskedWord = maskedWord.split(' ').map((char, index) => {
          return word[index] === guess ? guess : char; // Replace underscore with correct guess, keeping spacing
        }).join(' ');
        req.session.maskedWord = maskedWord; // Store updated masked word in session
        message = 'Correct guess!'
      } else {
        // Add the incorrect guess to list
        incorrectGuesses.push(guess)
        req.session.incorrectGuesses = incorrectGuesses
        message = 'Incorrect guess!'
      }

      req.session.totalGuesses += 1

      // Removes spaces added
      const fixedMaskedWord = maskedWord.replace(/ /g, '')
      const gameOver = fixedMaskedWord === word || incorrectGuesses.length === maxIncorrectGuesses
      const won = fixedMaskedWord === word
      

      if (gameOver) {
        // Save score to the database
        const scoresCollection = dbConnect.collection('scores')
        const score = {
          username: req.session.username,
          guesses: req.session.totalGuesses,
          wordLength: word.length,
        }
        await scoresCollection.insertOne(score)

        return res.json({ maskedWord, incorrectGuesses, gameOver, won, word, message: won ? 'You won!' : `Game over! The word was ${word}`  })
      }

      res.json({ maskedWord, incorrectGuesses, message })
    } catch (err) {
      console.error('Error making guess:', err)
      res.status(500).json({ error: 'Failed to process guess' })
    }
  })

//This will display the score screen
recordRoutes.get('/scores', async (req, res) => {
  try {
    const dbConnect = dbo.getDb()
    const scoresCollection = dbConnect.collection('scores')
    const { length } = req.query
    const scores = await scoresCollection
      // find the word length
      .find({ wordLength: parseInt(length) })
      // display the amount of guesses
      .sort({ guesses: 1 })
      // limit to 10 values of guesses
      .limit(10)
      .toArray()
    res.json(scores)
  } catch (err) {
    console.error('Error fetching scores: ', err)
    res.status(500).json({ error: 'Falied to fecth scores' })
  }
})

//We may want to set the word the player has to guess here.
recordRoutes.route('/login').post(async (req, res) => {
  try {
    const { username } = req.body
    console.log('Entered Login Route')
    console.log('the form had: ' + req.body.username)
    req.session.username = req.body.username
    console.log('The session username has been set to: ' + req.session.username)
    res.status(200).json({ message: 'Username set successfully' })
  } catch (err) {
    console.error('Error fetching message:', err)
    res.status(500).json({ error: 'Failed to fetch message' })
  }
})

module.exports = recordRoutes
