const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const bodyParser = require("body-parser");

const Words = require("./model/words-model");

// const allwords = "./db/allwords";

const app = express();

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"]
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

mongoose.connect(
  keys.mongodb.dbURI,
  () => {
    console.log("connected to mongodb");
  }
);

app.get("/", (req, res) => {
  res.send("hangman-game-be");
});

app.get("/words/:difficulty", (req, res) => {
  res.append("Content-Type", "application/json");
  Words.find({ difficulty: req.params.difficulty }).then(data => {
    res.send(data.filter(data => data));
  });
});

app.listen(3001, () => {
  console.log("BE of hangman-game listening on port 3001, Ctrl+C to stop");
});
