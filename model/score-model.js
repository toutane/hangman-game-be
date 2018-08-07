const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoresSchema = new Schema({
  player: String,
  score: Number,
  date: String,
  id: Number
});

const Scores = mongoose.model("score", scoresSchema);

module.exports = Scores;
