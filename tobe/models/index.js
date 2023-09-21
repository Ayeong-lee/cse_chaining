const mongoose = require('mongoose');
const MemberSchema = require('./member');
const BoardSchema = require('./board')
const TransactionSchema = require('./transaction')

const Member = mongoose.model('members', MemberSchema);
const Board = mongoose.model('boards', BoardSchema);
const Transaction = mongoose.model('transactions', TransactionSchema);

module.exports = {
  Member,
  Board,
  Transaction
}
