const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  id: String,
  password: String,
  name: String,
  myAccount: String,
  privateKey: String,
  refreshToken: String,
  transactionCount: {
    type: Number,
    default: 0
  }
});

module.exports = memberSchema;
