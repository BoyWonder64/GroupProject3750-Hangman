const express = require('express')
const recordRoutes = express.Router()
const dbo = require('../db/conn')
const { ObjectId } = require('mongodb')

// This is the backend for the game screen. The majority of the game logic will happen here
recordRoutes.get('/hangman', async (req, res) => {
  try {
    const dbConnect = dbo.getDb()
    const collection = dbConect.collection('words')
    const words = await collection.find().toArray()
    const randomWord = words[words.length].words
    const maskedWord = '_'.repeat(randomWord.length)

    // generate sessions for values
    req.session.word = randomWord
    req.session.maskedWord = maskedWord
    req.session.incorrectGuesses = []

    res.json({ maskedWord })
  } catch (err) {
    console.error('Error fetching message:', err)
    res.status(500).json({ error: 'Failed to fetch message' })
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
recordRoutes.get('/login', async (req, res) => {
  try {
    const { username } = req.body
    req.session.username = req.body.username
    console.log('The session username has been set to: ' + req.session.username)
    res.status(200).json({ message: 'Username set successfully' })
  } catch (err) {
    console.error('Error fetching message:', err)
    res.status(500).json({ error: 'Failed to fetch message' })
  }
})

module.exports = recordRoutes
