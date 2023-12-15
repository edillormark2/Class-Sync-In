const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const accountModel = require("./models/account");
const timeinModel = require("./models/timein");
const timeoutModel = require("./models/timeout");
const studentModel = require("./models/student");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/studentsyncin", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//User account
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await accountModel.findOne({ username });

    if (user) {
      // If the user exists, compare passwords directly
      if (password === user.password) {
        // If passwords match, send user data excluding the password
        const { _id, username /* other fields */ } = user;
        res.json({
          success: true,
          userData: { _id, username /* other fields */ }
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add Student time in based on student number
app.post("/addStudentTimeInByNumber", async (req, res) => {
  try {
    const { studentNo } = req.body;
    const existingStudent = await timeinModel.findOne({ studentNo });

    if (existingStudent) {
      if (existingStudent.Status === "Ongoing") {
        return res.status(400).json({ error: "Student already timed in" });
      }
      existingStudent.Status = "Ongoing";
      existingStudent.StatusBg = "#2ECC71";
      await existingStudent.save();
      return res.json(existingStudent);
    }

    // If the student doesn't exist, create a new timeIn record
    const currentDate = new Date();
    const formattedDate = `${currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })} - ${currentDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })}`;

    const recordId = Math.floor(1000000 + Math.random() * 9000000).toString(); // Generate a random recordId

    const timeInData = {
      studentNo: req.body.studentNo,
      studentName: req.body.studentName,
      course: req.body.course,
      section: req.body.section,
      contactNo: req.body.contactNo,
      timeIn: formattedDate, // or use your preferred time format
      Status: "Ongoing",
      StatusBg: "#2ECC71",
      recordId // Assigning the generated recordId
    };

    const newTimeIn = await timeinModel.create(timeInData);
    if (newTimeIn) {
      return res.json(newTimeIn);
    } else {
      return res.status(400).json({ error: "Failed to create Time In record" });
    }
  } catch (err) {
    console.error("Backend Error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Get all student time in
app.get("/studentTimeIn", async (req, res) => {
  try {
    const timein = await timeinModel.find();
    res.json(timein);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all student time out
app.get("/studentTimeOut", async (req, res) => {
  try {
    const timeout = await timeoutModel.find();
    res.json(timeout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student details by student number
app.get("/studentDetails/:studentNo", async (req, res) => {
  try {
    const { studentNo } = req.params;
    const studentDetails = await timeinModel.findOne({ studentNo });
    if (!studentDetails) {
      return res.status(404).json({ error: "Student details not found" });
    }
    res.json(studentDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student time out and move data to timeoutModel
app.put("/studentTimeOut/:studentNo", async (req, res) => {
  try {
    const { Status, timeOut, StatusBg } = req.body;

    // Fetch the student details from timeinModel
    const studentDetails = await timeinModel.findOneAndRemove({
      studentNo: req.params.studentNo
    });

    if (!studentDetails) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Generate a random recordId for the timeout record
    const recordId = Math.floor(1000000 + Math.random() * 9000000).toString();

    // Create a new record in timeoutModel with updated information including recordId
    const timeOutRecord = new timeoutModel({
      studentNo: studentDetails.studentNo,
      studentName: studentDetails.studentName,
      course: studentDetails.course,
      section: studentDetails.section,
      contactNo: studentDetails.contactNo,
      timeIn: studentDetails.timeIn,
      timeOut: timeOut,
      Status: Status,
      StatusBg: StatusBg,
      recordId // Assigning the generated recordId
    });

    // Save the updated timeout details in timeoutModel
    const savedTimeOut = await timeOutRecord.save();

    res.status(200).json({
      message: "Student timed out successfully",
      data: savedTimeOut
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Student
app.post("/addStudent", async (req, res) => {
  try {
    const newStudent = await studentModel.create(req.body);
    res.json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all student
app.get("/students", async (req, res) => {
  try {
    const students = await studentModel.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get student by ID
app.get("/students/:studentNo", async (req, res) => {
  try {
    const student = await studentModel.findOne({
      studentNo: req.params.studentNo
    });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student by ID
app.put("/updateStudent/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const updatedStudent = await studentModel.findOneAndUpdate(
      { studentNo: id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student by ID
app.delete("/deleteStudent/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedStudent = await studentModel.findOneAndDelete({
      studentNo: id
    });

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully", deletedStudent });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Merged the timein and timeout data
app.get("/mergedTimeRecords", async (req, res) => {
  try {
    const timeInRecords = await timeinModel.find({}, "-_id -__v").lean();
    const timeOutRecords = await timeoutModel.find({}, "-_id -__v").lean();

    const mergedRecords = [...timeInRecords, ...timeOutRecords];

    res.json(mergedRecords);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete the merged data or record data based on recordId
app.delete("/deleteMergedRecord/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTimeinRecord = await timeinModel.findOneAndDelete({
      recordId: id
    });

    const deletedTimeoutRecord = await timeoutModel.findOneAndDelete({
      recordId: id
    });

    if (!deletedTimeinRecord && !deletedTimeoutRecord) {
      return res.status(404).json({ error: "Merged record not found" });
    }

    res.status(200).json({
      message: `Merged record with recordId ${id} deleted successfully`
    });
  } catch (err) {
    console.error("Error deleting merged record:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get count of students
app.get("/studentCount", async (req, res) => {
  try {
    const studentCount = await studentModel.countDocuments();
    res.json({ count: studentCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get count of students currently timed in
app.get("/studentsTimeInCount", async (req, res) => {
  try {
    const studentsTimedInCount = await timeinModel.countDocuments({
      Status: "Ongoing"
    });
    res.json({ count: studentsTimedInCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get count of students who have timed out
app.get("/studentsTimedOutCount", async (req, res) => {
  try {
    const studentsTimedOutCount = await timeoutModel.countDocuments({
      Status: "Timed Out"
    });
    res.json({ count: studentsTimedOutCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
