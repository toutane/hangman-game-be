const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const wordsSchema = new Schema({
  word: String,
  difficulty: String
});

const Words = mongoose.model("word", wordsSchema);

module.exports = Words;
