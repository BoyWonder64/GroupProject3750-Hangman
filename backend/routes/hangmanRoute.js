const express = require("express");
 
const recordRoutes = express.Router();

const dbo = require("../db/conn");

const { ObjectId } = require('mongodb')

// fetch data
recordRoutes.get('/hangman', async (req, res) => {
  try {
    console.log("entered hangman route")
    const db = dbo.getDb();
    const collection = db.collection('words'); 

    const message = await collection.findOne({}, { projection: { _id: 0, Message: 1 } });
    console.log(message)
  
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    ///Right now message.value is blank...
    res.json({ Message: message.Message }); 
  } catch (err) {
    console.error('Error fetching message:', err);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

module.exports = recordRoutes;
