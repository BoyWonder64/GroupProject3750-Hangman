const express = require("express");
const session = require('express-session'); //We may need session....
const recordRoutes = express.Router();

const dbo = require("../db/conn");

const { ObjectId } = require('mongodb')

// This is the backend for the game screen. The majority of the game logic will happen here
recordRoutes.get('/hangman', async (req, res) => {
  try {
    const collection = db.collection('words'); 

   
  } catch (err) {
    console.error('Error fetching message:', err);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});


//This will display the score screen
recordRoutes.get('/scores', async (req, res) => {
  const { length } = req.query;
  const scores = await scoresCollection.find({ length: parseInt(length) }).sort({ guesses: 1 }).limit(10).toArray(); //Display top ten scores and return it
  res.json(scores);
});

//We may want to set the word the player has to guess here. 
recordRoutes.get('/login', async (req, res) => {
  try {
    const collection = db.collection('words'); 
    const { name } = req.body;

  } catch (err) {
    console.error('Error fetching message:', err);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});


module.exports = recordRoutes;
