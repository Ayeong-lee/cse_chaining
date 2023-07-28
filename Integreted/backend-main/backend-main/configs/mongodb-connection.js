const { MongoClient } = require("mongodb");
const uri = "mongodb+srv://ehdcks1224:rkskek1234@cluster0.7hsttm7.mongodb.net/board";

module.exports = function (callback) {
  return MongoClient.connect(uri, callback);
};
