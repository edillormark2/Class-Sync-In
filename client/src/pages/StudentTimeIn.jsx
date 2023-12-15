import React, { useState, useEffect } from "react";
import axios from "axios";
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
import Breadcrumbs from "../components/Breadcrumbs";
import { useStateContext } from "../contexts/ContextProvider";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { GoPersonAdd } from "react-icons/go";
import TimeInPopup from "../components/TimeInPopup";

const StudentTimeIn = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [StudentTimeIn, setTimeInData] = useState([]);
  const { currentColor } = useStateContext();

  const breadcrumbLinks = [
    { to: "/dashboard", label: "Home" },
    { to: "/student-time-in", label: "Student Time In" }
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

  const studentGridStatus = props =>
    <button
      type="button"
      style={{ background: props.StatusBg, cursor: "text" }}
      className="text-white py-1 px-2 w-20 capitalize rounded-xl text-md"
    >
      {props.Status}
    </button>;

  const columns = [
    {
      field: "studentNo",
      headerText: "Student No.",
      width: "135",
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
      width: "135",
      textAlign: "Center"
    },
    {
      field: "section",
      headerText: "Section",
      width: "135",
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
      width: "135",
      format: "yMd",
      textAlign: "Center"
    },

    {
      field: "Status",
      headerText: "Status",
      width: "135",
      textAlign: "Center",
      template: studentGridStatus
    }
  ];

  const handleOpenAdd = () => {
    setOpenPopup(true);
  };

  const fetchTimeInData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/studentTimeIn"); // Replace with your API endpoint
      setTimeInData(response.data); // Update the employeeData state with the fetched data
    } catch (error) {
      console.error("Error fetching timein data: ", error);
    }
  };

  useEffect(() => {
    fetchTimeInData(); // Fetch employee data when the component mounts
  }, []);

  const handleTimeinCreated = () => {
    // Callback function to refresh leave data after creating a leave
    fetchTimeInData();
  };

  return (
    <div className="m-2 sm:mx-4 m-4 mt-16 p-2 md:p-4 ">
      <div className="mb-5 flex justify-between items-start">
        <div>
          <p className="text-md text-gray-400">Pages</p>
          <p className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2 dark:text-gray-200">
            Student Time In
          </p>
          <Breadcrumbs links={breadcrumbLinks} className="flex" />
        </div>
        <button
          onClick={handleOpenAdd}
          className="mt-8 h-8 md:w-8 w-8"
          style={{
            backgroundColor: currentColor, // Color for "Download"
            color: "white",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            borderRadius: "20%",
            textDecoration: "none"
          }}
        >
          <GoPersonAdd title="Create" />
        </button>
      </div>
      <TimeInPopup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        onTimeinCreated={handleTimeinCreated}
      />
      <GridComponent
        dataSource={StudentTimeIn} // Use the fetched employee data
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
  );
};

export default StudentTimeIn;
