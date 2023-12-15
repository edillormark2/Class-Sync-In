const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  username: String,
  password: String,
  employeeID: Number
});

const accountModel = mongoose.model("Account", accountSchema);
module.exports = accountModel;
