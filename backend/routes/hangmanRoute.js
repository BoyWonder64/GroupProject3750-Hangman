const express = require('express')
const recordRoutes = express.Router()
const dbo = require('../db/conn')
const path = require('path')
//Used to read in file
const fs = require('fs')
const wordsFilePath = path.join(__dirname, '../words.csv')

// This is the backend for the game screen. The majority of the game logic will happen here
recordRoutes.get('/hangman', async (req, res) => {
  try {
    let wordList
    const dbConnect = dbo.getDb()

    const data = await fs.readFile(wordsFilePath, 'utf8')

    wordList = data.split('\n').map(word => word.trim())
    console.log('Succesfully loaded CSV File: ', wordList)

    const randomIndex = Math.floor(Math.random() * 1000) + 1 //randomly picks a number between 1 and 1000
    const chosenWord = wordList[randomIndex] //set the word based off of the index

    let maskedWord = currentWord.replace(/[a-zA-Z]/g, '_') // Mask all letters with underscores
    //TODO
    //We need to validate the guess each time one is made and change the _ to the correct letter if its correct

    // generate sessions for values
    req.session.word = chosenWord
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
