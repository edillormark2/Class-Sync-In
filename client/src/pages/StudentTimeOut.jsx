import React, { useState, useEffect } from "react";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import { useStateContext } from "../contexts/ContextProvider";
import { Divider } from "@mui/joy";
import CardTitle from "../components/CardTitle";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentTimeOut = () => {
  const { currentColor } = useStateContext();
  const breadcrumbLinks = [
    { to: "/dashboard", label: "Home" },
    { to: "/student-time-out", label: "Student Time Out" }
  ];

  const [studentNo, setStudentNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [section, setSection] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [timeIn, setTimein] = useState("");
  const [course, setCourse] = useState("");

  const handleFindDetails = async () => {
    if (!studentNo) {
      toast.error("Student No. is empty");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/studentDetails/${studentNo}`
      );
      const userData = response.data;
      if (userData) {
        setStudentNo(userData.studentNo);
        setStudentName(userData.studentName);
        setSection(userData.section);
        setContactNo(userData.contactNo);
        setTimein(userData.timeIn);
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      toast.error("Error fetching student details");
    }
  };

  const handleTimeOut = async () => {
    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })} - ${currentDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })}`;

      const timeOutData = {
        Status: "Timed Out",
        timeOut: formattedDate,
        StatusBg: "#DE3163"
      };

      const response = await axios.put(
        `http://localhost:3001/studentTimeOut/${studentNo}`,
        timeOutData
      );

      // Handle success or display a message
      toast.success("Student Timed Out recorded");
      setStudentNo("");
      setStudentName("");
      setCourse("");
      setSection("");
      setContactNo("");
      setTimein("");
      // Perform any other actions needed after recording timeout
    } catch (error) {
      // Handle error case
      console.error("Error while recording Time Out:", error);
      toast.error("Failed to record Time Out");
    }
  };

  // Fetch data when studentNo changes
  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/studentDetails/${studentNo}`
          );
          const userData = response.data;
          if (userData) {
            setStudentNo(userData.studentNo);
            setStudentName(userData.studentName);
            setSection(userData.section);
            setContactNo(userData.contactNo);
            setTimein(userData.timeIn);
          } else {
            // Reset form components if student not found
            setStudentNo("");
            setStudentName("");
            setSection("");
            setContactNo("");
            setTimein("");
          }
        } catch (error) {
          toast.error("This student hasn't time in yet!");
          // Reset form components if student not found
          setStudentNo("");
          setStudentName("");
          setSection("");
          setContactNo("");
          setTimein("");
        }
      };

      if (studentNo) {
        fetchData();
      }
    },
    [studentNo]
  );

  return (
    <div className="m-2 sm:mx-4 m-4 mt-16 p-2 md:p-4 ">
      <div className="mb-5 flex justify-between items-start">
        <div>
          <p className="text-md text-gray-400">Pages</p>
          <p className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2 dark:text-gray-200">
            Student Time Out
          </p>
          <Breadcrumbs links={breadcrumbLinks} className="flex" />
        </div>
      </div>
      <div className="md:flex justify-center m-3 gap-6 ">
        <div className=" bg-gray-100 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 mb-4 pt-9 rounded-md drop-shadow-lg min-w-[50%] max-w-[100%]">
          <div className="flex items-center justify-between mb-4">
            <CardTitle title="Student Time Out" />
          </div>
          <Divider />
          <div className="mt-14 md:mt-16 md:w-full p-6">
            <p className="mb-1 text-sm">Student No.</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full ">
                <OutlinedInput
                  value={studentNo}
                  onChange={e => setStudentNo(e.target.value)}
                />
              </FormControl>
            </form>
            <button
              type="button"
              sstyle={{
                color: "black",
                borderRadius: "16px",
                width: "100%"
              }}
              className={`text-md p-3 mt-16 w-full bg-gray-300 rounded-lg `}
              onClick={handleFindDetails}
            >
              Find Details
            </button>
            <button
              type="button"
              style={{
                backgroundColor: currentColor,
                color: "white",
                borderRadius: "10px",
                width: "100%"
              }}
              className={`text-md p-3 mt-8 w-full `}
              onClick={handleTimeOut}
            >
              Time Out
            </button>
          </div>
        </div>
        <div className="bg-gray-100 dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 mb-4 pt-9 rounded-md drop-shadow-lg min-w-[50%] max-w-[100%]">
          <div className="flex items-center justify-between mb-4">
            <CardTitle title="Student Time In Details" />
          </div>
          <Divider />
          <div className="mt-2 md:mt-3 md:w-full p-6">
            <p className="mb-1 text-sm">Student No.</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full ">
                <OutlinedInput value={studentNo} readOnly />
              </FormControl>
            </form>
            <p className="mb-1 mt-4 text-sm">Student Name</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full ">
                <OutlinedInput value={studentName} readOnly />
              </FormControl>
            </form>
            <p className="mb-1 mt-4 text-sm">Section</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full ">
                <OutlinedInput value={section} />
              </FormControl>
            </form>
            <p className="mb-1 mt-4 text-sm">Contact No.</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full ">
                <OutlinedInput value={contactNo} />
              </FormControl>
            </form>
            <p className="mb-1 mt-4 text-sm">Date & Time In</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full ">
                <OutlinedInput value={timeIn} />
              </FormControl>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTimeOut;
