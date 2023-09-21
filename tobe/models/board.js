const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  no: Number,
  subject: String,
  content: String,
  memberId: String,
  writer: String,
  writedate: String,
  minPrice: Number,
  imageLink: String,
});

module.exports = boardSchema;
