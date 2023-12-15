const mongoose = require("mongoose");

const timeoutSchema = new mongoose.Schema({
  studentNo: Number,
  studentName: String,
  course: String,
  section: String,
  timeIn: String,
  timeOut: String,
  contactNo: Number,
  Status: String,
  StatusBg: String,
  recordId: { type: String, unique: true } // Adding recordId as a unique string
});

const timeoutModel = mongoose.model("timeout", timeoutSchema);
module.exports = timeoutModel;
