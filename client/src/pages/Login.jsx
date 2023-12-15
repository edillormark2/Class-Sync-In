import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import { IconButton, InputAdornment } from "@mui/material";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import Dashboard from "./Dashboard";
import { useStateContext } from "../contexts/ContextProvider";
import { LuScanFace } from "react-icons/lu";
import ClassSyncInImage from "../assets/Class_sync.png";

const Login = () => {
  const { currentColor } = useStateContext();
  const [username, setUsername] = useState("");
  const [userNameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [visible, setVisible] = useState(false);
  const { isLoggedIn, login } = useStateContext();
  const navigate = useNavigate(); // Access the navigate function

  const handleLogin = userData => {
    login(userData);
    navigate("/dashboard");
  };
  const togglePasswordVisibility = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      window.history.replaceState(null, "", "/login");
    }
  }, []);

  const handleUsernameChange = event => {
    const value = event.target.value;
    setUsername(value);

    if (!value) {
      setUsernameError("Username is required.");
    } else {
      setUsernameError("");
    }
  };

  const handlePasswordChange = event => {
    const value = event.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError("Password is required.");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (!username || !password) {
      toast.error("Please fill in all the required fields");
      if (!username) setUsernameError("Username is required");
      if (!password) setPasswordError("Password is required");
      return;
    }

    const fetchAccount = async () => {
      try {
        const response = await axios.post("http://localhost:3001/login", {
          username: username,
          password: password
        });

        if (response.data.success) {
          toast.success("Login successful");
          const userData = response.data.userData;
          handleLogin(userData); // Pass user data to handleLogin
        } else {
          // Login failed, handle the failure case here
          toast.error("Username or password is invalid.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
        toast.error("Username or password is invalid.");
      }
    };

    // Call the fetchAccount function to perform the login
    fetchAccount();
  };
  const handleLogout = () => {
    // Perform logout actions, clear user data, set isLoggedIn to false, etc.
    // ...

    window.history.replaceState(null, "", "/login"); // Clear history after logout
  };
  const [isLeftContentVisible, setIsLeftContentVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setIsLeftContentVisible(screenWidth > 1224); // Adjust this breakpoint as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial screen size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="flex flex-col md:flex-row">
      {isLeftContentVisible &&
        <div
          className="md:w-2/3 hidden md:flex items-center justify-center flex-col items-center justify-center text-white p-0 md:p-6 "
          style={{
            backgroundColor: currentColor
          }}
        >
          <div
            className="  rounded-full w-2/3 md:w-2/4"
            style={{
              backgroundColor: " rgba(255, 255, 255, 0.63)", // Semi-transparent background color
              backdropFilter: "blur(25px) saturate(147%)", // Apply blur effect
              border: " 1px solid rgba(255, 255, 255, 0.125)",
              boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.37)" // Adding shadow for depth
            }}
          >
            <img
              src={ClassSyncInImage}
              alt="Class Sync In"
              style={{ width: "100%" }}
            />
          </div>
          <div
            className="text-center font-semibold mt-28 text-slate-300 text-5xl"
            style={{ fontFamily: "DS-Digital, sans-serif", fontSize: "2.3rem" }}
          >
            Class Sync In
          </div>
          <p className="text-xs mt-6 flex text-center p-2 bg-gray-400 text-white bg-opacity-40 rounded-xl w-11/12 md:w-3/4  drop-shadow-md">
            Effortlessly manage student attendance with 2D scanner-powered web
            app. Seamlessly record time-ins/outs, manage student profiles, and
            access an interactive dashboard for insights.
          </p>
        </div>}

      <div
        className={`md:w-${isLeftContentVisible
          ? "1/2"
          : "full"} flex justify-center items-center min-h-screen`}
      >
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg sm:rounded-xl rounded-md drop-shadow-2xl p-6 sm:max-w-md w-[90%]">
          <div className="flex justify-center text-4xl font-bold mb-4">
            <div
              className="flex fixed justify-center items-center text-5xl p-4 w-20 h-20 rounded-full text-white -mt-16"
              style={{
                backgroundColor: "rgba(26, 151, 245, 0.63)", // Semi-transparent background color
                backdropFilter: "blur(10px)", // Apply blur effect
                border: "1px solid rgba(255, 255, 255, 0.125)",
                borderRadius: "50%", // Make it round
                boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.37)" // Adding shadow for depth
              }}
            >
              <LuScanFace />
            </div>

            <h1 className="mt-10">Sign in</h1>
          </div>
          <p className="mb-1 text-sm">Username</p>
          <form onSubmit={handleSubmit}>
            <FormControl className="w-full">
              <OutlinedInput
                sx={{ border: "solid white 1px" }}
                value={username}
                onChange={handleUsernameChange}
                error={!!userNameError}
              />
            </FormControl>
            <div id="createHelp" className="text-red-500 text-sm">
              {userNameError}
            </div>
            <p className="mb-1 text-sm mt-6">Password</p>
            <FormControl className="w-full">
              <OutlinedInput
                sx={{ border: "solid white 1px" }}
                type={visible ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility} edge="end">
                      {visible ? <AiFillEye /> : <AiFillEyeInvisible />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <div id="createHelp" className="text-red-500 text-sm">
              {passwordError}
            </div>
            <div className="mt-6 flex justify-center">
              <button
                type="submit"
                style={{
                  backgroundColor: "#3498DB",
                  color: "white",
                  borderRadius: "10px"
                }}
                className={`text-md p-3 hover:bg-blue-500 hover:drop-shadow-md w-full`}
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
