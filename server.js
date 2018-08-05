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
  origin: ["http://gracious-johnson-fba7d0.netlify.com/"]
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

app.post("/words", (req, res) => {
  Words.findOne({ word: req.body.word }).then(currentWord => {
    console.log(currentWord);
    if (currentWord) {
      console.log("error word already exist: ", currentWord.word);
      res.status(208).send({
        error: true,
        message: `Word "${currentWord.word}" already exist`
      });
    } else {
      const word = Object.assign({}, req.body, {
        word: req.body.word,
        difficulty: req.body.difficulty
      });
      new Words(word).save((err, newWord) => {
        if (err) {
          return err;
        }
        console.log("created new word: ", newWord);
        res.status(201).send({
          error: false,
          message: `Word "${newWord.word}" succesfully added`
        });
      });
    }
  });
});

app.listen(3001, () => {
  console.log("BE of hangman-game listening on port 3001, Ctrl+C to stop");
});
