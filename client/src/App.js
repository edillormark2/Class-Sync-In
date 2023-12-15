import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useStateContext } from "./contexts/ContextProvider";
import Student from "./pages/Student";
import Sidebar from "./components/Sidebar";
import StudentTimeIn from "./pages/StudentTimeIn";
import StudentTimeOut from "./pages/StudentTimeOut";
import Records from "./pages/Records";
import "./App.css";
import AddStudent from "./pages/AddStudent";
import EditStudent from "./pages/EditStudent";

const App = () => {
  const { isLoggedIn } = useStateContext();

  useEffect(() => {
    // Save the current route to localStorage when the route changes
    const handleRouteChange = () => {
      localStorage.setItem("currentRoute", window.location.pathname);
    };

    window.addEventListener("beforeunload", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
    };
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer />
      {!isLoggedIn &&
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>}
      {isLoggedIn &&
        <div className="min-h-screen flex">
          <div className="drop-shadow-xl ">
            <Sidebar />
          </div>
          <div className="w-full min-w-[50%] max-w-[100%]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/student" element={<Student />} />
              <Route path="/student-time-in" element={<StudentTimeIn />} />
              <Route path="/student-time-out" element={<StudentTimeOut />} />
              <Route path="/student/add-student" element={<AddStudent />} />
              <Route
                path="/student/edit-student/:studentNo"
                element={<EditStudent />}
              />
              <Route path="/records" element={<Records />} />
              <Route
                path="/*"
                element={
                  <Navigate to={localStorage.getItem("currentRoute") || "/"} />
                }
              />
            </Routes>
          </div>
        </div>}
    </BrowserRouter>
  );
};

export default App;
