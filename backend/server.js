const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config({ path: "./config.env"});

app.use(cors());
app.use(express.json());
app.use(require("./routes/record"));

const dbo = require("./db/conn");

const port = process.env.PORT; // Links to config.env and grabs PORT variable (5000)

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    dbo.connectToServer(function(err) {
        if (err) {
            console.err(err);
        }
    });
    console.log(`Server is running on port ${port}`);
});

