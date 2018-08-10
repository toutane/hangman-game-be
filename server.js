const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const bodyParser = require("body-parser");
const shortid = require("shortid-36");
const moment = require("moment");

const Words = require("./model/words-model");
const Scores = require("./model/score-model");

// const allwords = "./db/allwords";

const app = express();

const corsOptions = {
  credentials: true,
  origin: [
    // "http://gracious-johnson-fba7d0.netlify.com/",
    // "http://localhost:3000",
    "http://hangman.42.gy",
    "https://hangman.42.gy"
  ]
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
  res.send("Hangman-game BACKEND 🐛");
});

app.get("/words/:difficulty", (req, res) => {
  res.append("Content-Type", "application/json");
  Words.find({ difficulty: req.params.difficulty }).then(data => {
    res.send(data.filter(data => data));
  });
});

app.get("/scores", (req, res) => {
  res.append("Content-Type", "application/json");
  Scores.find({ date: moment().format("L") }).then(data => {
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
        word: req.body.word.trim(),
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

app.post("/scores", (req, res) => {
  // Scores.findOne({ player: req.body.player }).then(currentScore => {
  //   console.log(currentScore);
  //   if (currentScore) {
  //     console.log("error word already exist: ", currentScore.word);
  //     res.status(208).send({
  //       error: true,
  //       message: `Word "${currentScore.word}" already exist`
  //     });
  //   } else {
  const score = Object.assign({}, req.body, {
    score: req.body.score,
    player: req.body.player,
    date: req.body.date
    // id: shortid.generate()
  });
  new Scores(score).save((err, newScore) => {
    if (err) {
      return err;
    }
    console.log("created new score: ", newScore);
    res.status(201).send({
      error: false,
      message: `Score of "${newScore.player}" succesfully added`
    });
    // });
    // }
  });
});

app.listen(3001, () => {
  console.log("BE of hangman-game listening on port 3001, Ctrl+C to stop");
});
