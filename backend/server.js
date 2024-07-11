const express = require("express");
const app = express();
const cors = require("cors");

const session = require('express-session');
const MongoStore = require('connect-mongo');
const { MongoClient, ServerApiVersion } = require('mongodb')

require("dotenv").config({path: "./config.env"});

const port = process.env.PORT;

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
  }));

app.use(session(
    {
        secret: 'keyboard cat',
        saveUninitialized: false, //dont create sessions until something is stored
        resave: false, //dont save session if unmodified
        store: MongoStore.create({
            mongoUrl: process.env.ALTAS_URI
        })
    }
));

const dbo = require("./db/conn")

app.use(express.json());

//Routes



app.use(require("./routes/hangmanRoute"));


app.listen(port, () => {
    dbo.connectToServer(function(err){
        if(err){
            console.err(err);
        }
    });
    console.log(`Server is running on port ${port}`);
});
