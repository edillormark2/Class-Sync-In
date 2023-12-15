const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentNo: Number,
  studentName: String,
  section: String,
  course: String,
  section: String,
  contactNo: Number,
  Status: String,
  email: String
});

const studentModel = mongoose.model("Student", studentSchema);
module.exports = studentModel;
