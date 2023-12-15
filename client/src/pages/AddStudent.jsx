import React, { useState } from "react";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import CardTitle from "../components/CardTitle";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Divider } from "@mui/joy";
import { useStateContext } from "../contexts/ContextProvider";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddStudent = () => {
  const { currentColor } = useStateContext();
  const breadcrumbLinks = [
    { to: "/dashboard", label: "Home" },
    { to: "/student", label: "Manage Student" },
    { to: "/student/add-student", label: "Add Student" }
  ];
  const [studentNo, setStudentNo] = useState("");
  const [studentNoError, setStudentNoError] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentNameError, setStudentNameError] = useState("");
  const [course, setCourse] = useState("");
  const [courseError, setCourseError] = useState("");
  const [section, setSection] = useState("");
  const [sectionError, setSectionError] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [contactNoError, setContactNoError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleStudentNoChange = event => {
    const value = event.target.value;
    setStudentNo(value);

    if (!value) {
      setStudentNoError("Student number is required.");
    } else {
      setStudentNoError("");
    }
  };

  const handleStudentNameChange = event => {
    const value = event.target.value;
    setStudentName(value);

    if (!value) {
      setStudentNameError("Name is required.");
    } else {
      setStudentNameError("");
    }
  };

  const handleCourseChange = event => {
    const value = event.target.value;
    setCourse(value);

    if (!value) {
      setCourseError("Student course is required.");
    } else {
      setCourseError("");
    }
  };

  const handleSectionChange = event => {
    const value = event.target.value;
    setSection(value);

    if (!value) {
      setSectionError("Student section is required.");
    } else {
      setSectionError("");
    }
  };

  const handleContactNoChange = event => {
    const value = event.target.value;
    setContactNo(value);

    if (!value) {
      setContactNoError("Student contact no. is required.");
    } else {
      setContactNoError("");
    }
  };

  const handleEmailChange = event => {
    const value = event.target.value;
    setEmail(value);

    if (!value) {
      setEmailError("Student email is required.");
    } else {
      setEmailError("");
    }
  };

  const addStudent = event => {
    event.preventDefault();

    if (
      !studentNo ||
      !studentName ||
      !section ||
      !course ||
      !email ||
      !contactNo
    ) {
      toast.error("Please fill in all the required fields");
      if (!studentNo) setStudentNoError("Student number is required.");
      if (!studentName) setStudentNameError("Name is required.");
      if (!section) setSectionError("Student section is required.");
      if (!course) setCourseError("Student course is required.");
      if (!email) setEmailError("Student email is required.");
      if (!contactNo) setContactNoError("Student contact no. is required.");
      return;
    }

    axios
      .post("http://localhost:3001/addStudent", {
        studentNo: studentNo,
        studentName: studentName,
        course: course,
        section: section,
        contactNo: contactNo,
        email: email,
        Status: "NotTimeIn"
      })
      .then(result => {
        toast.success("Student added successfully");
        setStudentNo("");
        setStudentName("");
        setCourse("");
        setSection("");
        setContactNo("");
        setEmail("");
      })
      .catch(err => {
        toast.error("Error adding student");
      });
  };

  return (
    <div className="m-2 md:m-6 mt-16 p-2 md:p-10 sm:rounded-3xl rounded-md ">
      <p className="text-md text-gray-400">Pages</p>
      <p className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2 dark:text-gray-200">
        Add Student
      </p>
      <Breadcrumbs links={breadcrumbLinks} className="flex" />
      <div className="m-1 md:m-6 mt-10 p-2 md:p-8 bg-white sm:rounded-3xl rounded-md drop-shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <CardTitle title="Student Details" />
        </div>
        <Divider />
        <div className="flex flex-col mt-0 sm:mt-5 md:flex-row md:items-center gap-5">
          <div className="mt-2 sm:mt-0 md:w-1/2">
            <p className="mb-0 sm:mb-4 text-sm">Student No.</p>
            <form type="text" noValidate autoComplete="off">
              <FormControl className="w-full">
                <OutlinedInput
                  value={studentNo}
                  onChange={handleStudentNoChange}
                />
              </FormControl>
            </form>
            <div id="createHelp" className="text-red-500 text-sm">
              {studentNoError}
            </div>
          </div>
          <div className="mt-2 sm:mt-0 md:w-1/2">
            <p className="mb-0 sm:mb-4 text-sm">Student Name</p>
            <form type="text" noValidate autoComplete="off">
              <FormControl className="w-full">
                <OutlinedInput
                  value={studentName}
                  onChange={handleStudentNameChange}
                />
              </FormControl>
            </form>
            <div id="createHelp" className="text-red-500 text-sm">
              {studentNameError}
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-0 sm:mt-5 md:flex-row md:items-center gap-5">
          <div className="mt-2 sm:mt-0 md:w-1/2">
            <p className="mb-0 sm:mb-4 text-sm">Course</p>
            <form type="text" noValidate autoComplete="off">
              <FormControl className="w-full">
                <OutlinedInput value={course} onChange={handleCourseChange} />
              </FormControl>
            </form>
            <div id="createHelp" className="text-red-500 text-sm">
              {courseError}
            </div>
          </div>
          <div className="mt-2 sm:mt-0 md:w-1/2">
            <p className="mb-0 sm:mb-4 text-sm">Section</p>
            <form type="text" noValidate autoComplete="off">
              <FormControl className="w-full">
                <OutlinedInput value={section} onChange={handleSectionChange} />
              </FormControl>
            </form>
            <div id="createHelp" className="text-red-500 text-sm">
              {sectionError}
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-0 sm:mt-5 md:flex-row md:items-center gap-5">
          <div className="mt-2 sm:mt-0 md:w-1/2">
            <form type="text" noValidate autoComplete="off">
              <p className="mb-0 sm:mb-4 text-sm">Contact No.</p>
              <FormControl className="w-full">
                <OutlinedInput
                  value={contactNo}
                  onChange={handleContactNoChange}
                />
              </FormControl>
            </form>
            <div id="createHelp" className="text-red-500 text-sm">
              {contactNoError}
            </div>
          </div>
          <div className="mt-2 sm:mt-0 md:w-1/2">
            <p className="mb-0 sm:mb-4 text-sm">Email</p>
            <form type="text" noValidate autoComplete="off">
              <FormControl className="w-full">
                <OutlinedInput value={email} onChange={handleEmailChange} />
              </FormControl>
            </form>
            <div id="createHelp" className="text-red-500 text-sm">
              {emailError}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          style={{
            backgroundColor: currentColor,
            color: "white",
            borderRadius: "10px",
            width: "150px"
          }}
          className={`text-md p-3 hover:bg-blue-500 hover:drop-shadow-2xl`}
          onClick={addStudent}
        >
          Add Student
        </button>
      </div>
    </div>
  );
};

export default AddStudent;
