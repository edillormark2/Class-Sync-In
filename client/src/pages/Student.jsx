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
  Edit,
  Selection,
  Sort,
  PageSettingsModel
} from "@syncfusion/ej2-react-grids";
import Breadcrumbs from "../components/Breadcrumbs";
import { GoPersonAdd } from "react-icons/go";
import { useStateContext } from "../contexts/ContextProvider";
import { AiOutlineDelete } from "react-icons/ai";
import { DropDownListComponent } from "@syncfusion/ej2-react-dropdowns";
import { Link } from "react-router-dom";
import EditStudentAB from "../components/EditStudentAB";
import DeleteStudent from "../components/DeleteStudent";

const Student = ({ studentNo }) => {
  const { currentColor } = useStateContext();
  const breadcrumbLinks = [
    { to: "/dashboard", label: "Home" },
    { to: "/student", label: "Manage Student" }
  ];

  const [studentData, setStudentData] = useState([]);
  const [selectedStudentNo, setSelectedStudentNo] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);

  const handleDeletePopup = studentNo => {
    setSelectedStudentNo(studentNo);
    setOpenPopup(true);
  };

  const handleEditClick = studentNo => {
    console.log("Edit clicked for studentNo:", studentNo);
  };

  const studentGrid = [
    {
      field: "studentNo",
      headerText: "Student No.",
      width: "125",
      textAlign: "Center"
    },
    {
      field: "studentName",
      headerText: "Name",
      width: "140",
      textAlign: "Center"
    },
    {
      field: "course",
      headerText: "Course",
      width: "140",
      textAlign: "Center"
    },
    {
      field: "section",
      headerText: "Section",
      width: "140",
      textAlign: "Center"
    },
    {
      field: "contactNo",
      headerText: "Contact No.",
      width: "120",
      textAlign: "Center"
    },

    {
      field: "email",
      headerText: "Email",
      width: "135",
      format: "yMd",
      textAlign: "Center"
    },

    {
      field: "Action",
      headerText: "Action",
      width: "125",
      textAlign: "Center",
      template: props =>
        <div className="flex justify-center">
          <EditStudentAB
            studentNo={props.studentNo}
            onEditClick={handleEditClick}
          />
          <button
            onClick={() => {
              handleDeletePopup(props.studentNo);
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
        style={{ width: "20px", marginLeft: "20px" }}
      />
      <span style={{ marginLeft: "10px" }}>Entries per page</span>
    </div>;

  const fetchStudentData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/students");
      setStudentData(response.data);
    } catch (error) {
      console.error("Error fetching student data: ", error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const handleStudentCreated = () => {
    fetchStudentData();
  };

  const handleStudentDeleted = () => {
    fetchStudentData();
  };

  return (
    <div className="m-2 sm:mx-4 m-4 mt-16 p-2 md:p-4 ">
      <div className="mb-5 flex justify-between items-start">
        <div>
          <p className="text-md text-gray-400">Pages</p>
          <p className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2 dark:text-gray-200">
            Manage Student
          </p>
          <Breadcrumbs links={breadcrumbLinks} className="flex" />
        </div>
        <Link to={`/student/add-student`}>
          <button
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
        </Link>
      </div>
      <DeleteStudent
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}
        studentNo={selectedStudentNo}
        onStudentDeleted={handleStudentDeleted}
      />
      <GridComponent
        dataSource={studentData}
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
          {studentGrid.map((item, index) =>
            <ColumnDirective key={index} {...item} />
          )}
        </ColumnsDirective>
        <Inject services={[Page, Search, Toolbar, Selection, Sort]} />
      </GridComponent>
    </div>
  );
};

export default Student;
