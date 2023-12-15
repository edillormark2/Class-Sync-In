import React, { useState, useEffect } from "react";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Search,
  Inject,
  Toolbar,
  Selection,
  Sort
} from "@syncfusion/ej2-react-grids";
import {
  ScheduleComponent,
  Day,
  Week,
  Month,
  Resize,
  DragAndDrop
} from "@syncfusion/ej2-react-schedule";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { useStateContext } from "../contexts/ContextProvider";
import { AiOutlineDelete } from "react-icons/ai";
import { RiOpenArmLine } from "react-icons/ri";
import { HiLogout } from "react-icons/hi";
import axios from "axios";
import { MdAccessTime } from "react-icons/md";
import CardTitle from "../components/CardTitle";
import Clock from "../components/Clock";

const Dashboard = () => {
  const { currentColor } = useStateContext();
  const [studentCount, setStudentCount] = useState(null);
  const [timeinCount, setTimeinCount] = useState(null);
  const [timeoutCount, setTimeoutCount] = useState(null);
  const [StudentTimein_TimeOut, setTimeIn_TimeOutData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const intervalID = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  const formattedDateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const response = await axios.get("http://localhost:3001/studentCount");
        setStudentCount(response.data.count);
      } catch (error) {
        setStudentCount("-");
        console.error("Error:", error);
      }
    }

    fetchStudentData();
  }, []);

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const response = await axios.get(
          "http://localhost:3001/studentsTimeInCount"
        );
        setTimeinCount(response.data.count);
      } catch (error) {
        setTimeinCount("-");
        console.error("Error:", error);
      }
    }

    fetchStudentData();
  }, []);

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const response = await axios.get(
          "http://localhost:3001/studentsTimedOutCount"
        );
        setTimeoutCount(response.data.count);
      } catch (error) {
        setTimeoutCount("-");
        console.error("Error:", error);
      }
    }

    fetchStudentData();
  }, []);

  const studentData = [
    {
      icon: <MdOutlineSupervisorAccount />,
      amount: studentCount,
      title: "Students",
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
      pcColor: "red-600"
    },
    {
      icon: <MdAccessTime />,
      amount: timeinCount,
      title: "Students Time In",
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
      pcColor: "red-600"
    },
    {
      icon: <HiLogout />,
      amount: timeoutCount,
      title: "Students Timed Out",
      iconColor: "#03C9D7",
      iconBg: "#E5FAFB",
      pcColor: "red-600"
    }
  ];

  const pageSizes = [9, 20, 50];
  const [pageSize, setPageSize] = useState(9);

  const handlePageSizeChange = e => {
    setPageSize(e.value);
  };

  const template = () =>
    <div style={{ display: "flex", alignItems: "center" }}>
      <DropDownListComponent
        dataSource={pageSizes}
        index={pageSizes.indexOf(pageSize)}
        change={handlePageSizeChange}
        style={{ width: "20px", marginLeft: "20px" }} // Adjust the width as needed
      />
      <span style={{ marginLeft: "10px" }}>Entries per page</span>
    </div>;

  const studentGridStatus = props => {
    let statusBgColor = "";

    if (props.Status === "Ongoing") {
      statusBgColor = "#2ECC71";
    } else if (props.Status === "Timed Out") {
      statusBgColor = "#DE3163";
    }

    return (
      <button
        type="button"
        style={{ background: statusBgColor, cursor: "text" }}
        className="text-white py-1 px-2 w-20 capitalize rounded-xl text-md"
      >
        {props.Status}
      </button>
    );
  };

  const fetchTimeInData = async () => {
    try {
      const response = await axios.get(
        ` http://localhost:3001/mergedTimeRecords`
      ); // Replace with your API endpoint
      setTimeIn_TimeOutData(response.data); // Update the employeeData state with the fetched data
    } catch (error) {
      console.error("Error fetching timein data: ", error);
    }
  };

  useEffect(() => {
    fetchTimeInData(); // Fetch employee data when the component mounts
  }, []);

  const handleRecordDeleted = () => {
    // Callback function to refresh leave data after creating a leave
    fetchTimeInData();
  };
  const columns = [
    {
      field: "studentNo",
      headerText: "Student No.",
      width: "110",
      textAlign: "Left"
    },
    {
      field: "studentName",
      headerText: "Name",
      width: "135",
      textAlign: "Left"
    },
    {
      field: "course",
      headerText: "Course",
      width: "110",
      textAlign: "Center"
    },
    {
      field: "section",
      headerText: "Section",
      width: "110",
      textAlign: "Center"
    },
    {
      field: "contactNo",
      headerText: "Contact",
      width: "135",
      textAlign: "Center"
    },
    {
      field: "timeIn",
      headerText: "Time In",
      width: "155",
      format: "yMd",
      textAlign: "Left"
    },
    {
      field: "timeOut",
      headerText: "Time Out",
      width: "155",
      format: "yMd",
      textAlign: "Left"
    },
    {
      field: "Status",
      headerText: "Status",
      width: "110",
      textAlign: "Center",
      template: studentGridStatus
    }
  ];

  return (
    <div className="m-2  mt-16 p-2 ">
      <div>
        <p className="text-md text-gray-400">Pages</p>
        <p className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2 dark:text-gray-200">
          Dashboard
        </p>

        <div className="flex m-3 flex-wrap justify-center gap-3 items-center drop-shadow-md">
          {studentData.map(item =>
            <div
              key={item.title}
              className="relative w-40 sm:w-56 bg-white h-44 dark:text-gray-200 dark:bg-secondary-dark-bg  p-4 pt-9 rounded-2xl "
            >
              <button
                type="button"
                style={{
                  color: item.iconColor,
                  backgroundColor: item.iconBg
                }}
                className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
              >
                {item.icon}
              </button>
              <p className="mt-3">
                <span className="text-lg font-semibold">
                  {item.amount}
                </span>
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {item.title}
              </p>
            </div>
          )}
          <div
            className="relative bg-white h-44 bg-blue-400 bg-opacity-40 w-72 p-4 rounded-2xl text-white font-semibold text-2xl drop-shadow-lg"
            style={{
              backdropFilter: "blur(6px) saturate(98%)",
              WebkitBackdropFilter: "blur(6px) saturate(98%)", // Webkit prefix for older Safari
              border: "1px solid rgba(255, 255, 255, 0.125)"
            }}
          >
            <Clock />
          </div>
        </div>
      </div>

      <div className="m-2 md:m-6 mt-2 flex  justify-center">
        <div className="w-full  mr-0 md:mr-4 mb-4 md:mb-0">
          <div className="bg-white drop-shadow-xl p-4">
            <CardTitle title="Time In & Time Out Record" />
            <GridComponent
              dataSource={StudentTimein_TimeOut}
              allowPaging={true}
              pageSettings={{ pageSize: pageSize }}
              allowSorting={true}
              toolbar={[
                "Search",
                {
                  text: "",
                  template: template
                }
              ]}
              width="auto"
            >
              <ColumnsDirective>
                {columns.map((item, index) =>
                  <ColumnDirective key={index} {...item} />
                )}
              </ColumnsDirective>
              <Inject services={[Page, Search, Toolbar, Selection, Sort]} />
            </GridComponent>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
