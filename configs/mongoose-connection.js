const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const uri =
  "mongodb+srv://ehdcks1224:rkskek1234@cluster0.7hsttm7.mongodb.net/board?retryWrites=true&w=majority";

module.exports = function () {
  return mongoose.connect(uri, { useNewUrlParser: true });
};
