const express = require('express')
const recordRoutes = express.Router()
const dbo = require('../db/conn')
//Used to read in file
const fs = require('fs') // Use the promises API
const wordsFilePath = 'words.csv'

// This is the backend for the game screen. The majority of the game logic will happen here
recordRoutes.get('/hangman', (req, res) => {
  try {
    
    if(!req.session.username){
      console.log("Username session is not set!")
      return res.status(501).json({error: "Username Session is not set"})
    }

    let wordList;
    const dbConnect = dbo.getDb();
    console.log("Entered Hangman Route");
    console.log("The filepath is set to: " + wordsFilePath);

    fs.readFile(wordsFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error fetching message:', err);
        return res.status(500).json({ error: 'Failed to fetch message' });
      }

      wordList = data.split('\n').map(word => word.trim());
      console.log('Successfully loaded CSV File:' )

      const randomIndex = Math.floor(Math.random() * 1000) + 1; // Randomly picks a number between 1 and 1000
      const choosenWord = wordList[randomIndex]; // Set the word based off of the index
      console.log("The choosen word is: " + choosenWord)

      let maskedWord = choosenWord.replace(/[a-zA-Z]/g, '_'); // Mask all letters with underscores

      req.session.word = choosenWord;
      req.session.maskedWord = maskedWord;
      req.session.incorrectGuesses = [];

      res.json({ maskedWord });
    });
  } catch (err) {
    console.error('Error fetching message:', err);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});


recordRoutes.post("/guess" , (req, res) => {
  console.log("Entered the guess route")

  if(!req.session.username){
    console.log("Username session is not set!")
    return res.status(501).json({error: "Username Session is not set"})
  }


  let { word, maskedWord, incorrectGuesses } = req.session; //Set the session
  let newMaskedword = "" 
  let guessFlag = false; //Set the game flag
  let {guess} = req.body

 
  guess = guess.toLowerCase(); //set to lowercase because words in DB contains uppercased words
  word = word.toLowerCase();

  console.log("The guessed letter was: " + guess)
  console.log("The choosen word is: " + req.session.word)

  if (!guess || !/^[a-zA-Z]$/.test(guess)) { //Check if null or not a letter
    return res.status(400).json({ error: 'Invalid letter' });
  } 


  for (let i = 0; i < word.length; i++) {
    if (word[i] === guess) {
      newMaskedword += guess; //adds letter to the new mask
      guessFlag = true;
    } else {
      newMaskedword += maskedWord[i];
    }
  }
  //Update the incorrect letter array
  if (guessFlag === false) {
    if(!incorrectGuesses.includes(guess)) { //if the array  does not includes the letter
      incorrectGuesses.push(guess); //add it to the array
    }
  }
   
  //if the masked word is complete
  if(word === newMaskedword){
    console.log("The word has been guessed!")
  }
  //otherwise set the sessions 
  req.session.maskedWord = newMaskedword;
  req.session.incorrectGuesses = incorrectGuesses;
  //and return the json back to the frontend
  res.json({ maskedWord: newMaskedword, incorrectGuesses });

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
