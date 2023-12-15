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
import { GoPersonAdd } from "react-icons/go";
import { useStateContext } from "../contexts/ContextProvider";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { AiOutlineDelete } from "react-icons/ai";
import DeletePopup from "../components/DeletePopup";

const Records = () => {
  const { currentColor } = useStateContext();
  const [StudentTimein_TimeOut, setTimeIn_TimeOutData] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  const breadcrumbLinks = [
    { to: "/dashboard", label: "Home" },
    { to: "/records", label: "Student Records" }
  ];

  const handleDeletePopup = recordId => {
    setSelectedRecordId(recordId);
    setOpenPopup(true);
  };

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
    },
    {
      field: "Action",
      headerText: "Action",
      width: "125",
      textAlign: "Center",
      template: props =>
        <div className="flex justify-center">
          <button
            onClick={() => {
              handleDeletePopup(props.recordId);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px", // Set a fixed width
              height: "28px", // Set a fixed height
              border: "none",
              cursor: "pointer",
              borderRadius: "30%", // To make it a circle
              textDecoration: "none",
              backgroundColor: "#DE3163"
            }}
          >
            <AiOutlineDelete
              title="Delete"
              style={{
                color: "white",
                fontSize: "18px"
              }}
            />
          </button>
        </div>
    }
  ];

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

  return (
    <div className="m-2 sm:mx-4 m-4 mt-16 p-2 md:p-4 ">
      <div className="mb-5 flex justify-between items-start">
        <div>
          <p className="text-md text-gray-400">Pages</p>
          <p className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2 dark:text-gray-200">
            Student Time In & Time Out
          </p>
          <Breadcrumbs links={breadcrumbLinks} className="flex" />
        </div>
      </div>
      <DeletePopup
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        recordId={selectedRecordId}
        onRecordDeleted={handleRecordDeleted}
      />
      <GridComponent
        dataSource={StudentTimein_TimeOut} // Use the fetched employee data
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

export default Records;
