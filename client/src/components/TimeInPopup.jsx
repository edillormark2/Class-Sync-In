import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStateContext } from "../contexts/ContextProvider";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ModalClose from "@mui/joy/ModalClose";
import CardTitle from "./CardTitle";
import { Divider } from "@mui/joy";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const TimeInPopup = props => {
  const { openPopup, setOpenPopup } = props;
  const { currentColor } = useStateContext();
  const isMobile = window.innerWidth <= 768 && window.innerHeight <= 1024;

  const [section, setSection] = useState("");
  const [course, setCourse] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [studentNo, setStudentNo] = useState("");
  const [studentName, setStudentName] = useState("");
  const [timeIn, setTimein] = useState("");

  const handleClosePopup = () => {
    // Resetting all the state variables to empty when the popup closes
    setStudentNo("");
    setStudentName("");
    setCourse("");
    setSection("");
    setContactNo("");
    setTimein("");
    setOpenPopup(false);
  };

  // Fetch data when studentNo changes
  useEffect(
    () => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/students/${studentNo}`
          );
          const userData = response.data;
          if (userData) {
            setStudentNo(userData.studentNo);
            setStudentName(userData.studentName);
            setCourse(userData.course);
            setSection(userData.section);
            setContactNo(userData.contactNo);
            setTimein(userData.timeIn);
          } else {
            // Reset form components if student not found
            setStudentNo("");
            setStudentName("");
            setCourse("");
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

  const handleTimeIn = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/addStudentTimeInByNumber",
        {
          studentNo: studentNo,
          studentName: studentName,
          course: course,
          section: section,
          contactNo: contactNo
        }
      );

      if (response.data) {
        const { message } = response.data;
        toast.success("Student time in recorded");

        props.onTimeinCreated();
        setStudentNo("");
        setStudentName("");
        setCourse("");
        setSection("");
        setContactNo("");
        setTimein("");
        setOpenPopup(false);
      } else {
        toast.error("Student already time in");
      }
    } catch (error) {
      toast.error("Student already time in");
    }
  };

  const dynamicPopupStyle = {
    position: "absolute",
    top: isMobile ? "48%" : "40%",
    left: "50%",
    width: "min(80%, 600px)",
    height: isMobile ? "90vh" : "min(75%, 90vh)",
    transform: "translate(-50%, -50%)",
    overflowY: "auto",
    p: 4
  };
  return (
    <div>
      <Modal open={openPopup} onClose={handleClosePopup}>
        <Box
          sx={dynamicPopupStyle}
          style={
            isMobile || window.innerWidth <= window.innerHeight * 2
              ? dynamicPopupStyle
              : null
          }
          className="m-2 md:m-10 mt-10 p-4 md:p-10 bg-white rounded-md  "
        >
          <ModalClose variant="outlined" onClick={() => setOpenPopup(false)} />
          <CardTitle title="Add Student Time In" />
          <Divider />
          <div className="mt-2 md:mt-3 md:w-full">
            <p className="mb-1 text-sm">Student No.</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full ">
                <OutlinedInput
                  value={studentNo}
                  onChange={e => setStudentNo(e.target.value)}
                />
              </FormControl>
            </form>
          </div>
          <div className="mt-2 md:mt-3 md:w-full">
            <p className="mb-1 text-sm">Student</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full ">
                <OutlinedInput value={studentName} />
              </FormControl>
            </form>
          </div>
          <div className="mt-2 md:mt-3 md:w-full">
            <p className="mb-1 text-sm">Course</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full">
                <OutlinedInput value={course} />
              </FormControl>
            </form>
          </div>
          <div className="mt-2 md:mt-3 md:w-full">
            <p className="mb-1 text-sm">Section</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full">
                <OutlinedInput value={section} />
              </FormControl>
            </form>
          </div>
          <div className="mt-2 md:mt-3 md:w-full">
            <p className="mb-1 text-sm">Contact No.</p>
            <form name="name" type="text" noValidate autoComplete="off">
              <FormControl className="w-full">
                <OutlinedInput value={contactNo} />
              </FormControl>
            </form>
          </div>
          <div class="mt-12 flex justify-end items-center gap-3">
            <button
              type="button"
              style={{
                color: "black",
                borderRadius: "10px",
                width: "100px"
              }}
              className={`text-md p-3 bg-gray-300`}
              onClick={() => setOpenPopup(false)}
            >
              Close
            </button>
            <button
              type="button"
              style={{
                backgroundColor: currentColor,
                color: "white",
                borderRadius: "10px",
                width: "100px"
              }}
              className={`text-md p-3 `}
              onClick={handleTimeIn}
            >
              Time In
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default TimeInPopup;
