const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  memberId: String,
  url: String,
  campaignName: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = transactionSchema;
