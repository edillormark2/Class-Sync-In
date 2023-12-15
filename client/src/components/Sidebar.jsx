import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip"; // Import Tooltip component from Material-UI
import Zoom from "@mui/material/Zoom";
import { RxDashboard } from "react-icons/rx";
import { LuTimer } from "react-icons/lu";
import { FaRegUser, FaRegCalendarTimes } from "react-icons/fa"; // Consolidating FaRegUser and FaRegCalendarTimes
import { FaListCheck } from "react-icons/fa6";
import { MdLogout } from "react-icons/md";
import { LuScanFace } from "react-icons/lu";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useStateContext } from "../contexts/ContextProvider";
import LogoutPopup from "./LogoutPopup";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const { currentColor } = useStateContext();
  const [openPopup, setOpenPopup] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1284);
      if (window.innerWidth <= 1284) {
        setOpen(false); // Close sidebar on mobile view
      } else {
        setOpen(true); // Open sidebar on larger screens
      }
    };

    // Initial check and add event listener for resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const iconSizeClass = open ? "text-xl" : "text-xl";
  const titleMarginClass = open ? "ml-4" : "";

  const [isSettingsSelected, setIsSettingsSelected] = useState(false);

  const handleSettingsClick = () => {
    setIsSettingsSelected(!isSettingsSelected);
    setSelectedMenu("");
    setOpenPopup(true);
  };

  const Menus = [
    { title: "Dashboard", icon: <RxDashboard />, link: "/dashboard" },
    { title: "Student", icon: <FaRegUser />, link: "/student" },
    { title: "TimeIn", icon: <LuTimer />, link: "/student-time-in" },
    {
      title: "TimeOut",
      icon: <FaRegCalendarTimes />,
      link: "/student-time-out"
    },
    { title: "Records", icon: <FaListCheck />, link: "/records" }
  ];

  const handleClick = title => {
    setSelectedMenu(title);
    setIsSettingsSelected(false);
  };

  return (
    <div className="flex">
      <div
        className={` ${open
          ? "w-64"
          : "w-20 "} bg-dark-purple h-[149vh] sm:h-screen max-h-[500%] p-5 pt-8 relative duration-300 shadow-md `}
      >
        <div className="drop-shadow-lg relative">
          <FaArrowLeftLong
            className={`absolute cursor-pointer -right-16 -top-5 w-8 h-8  rounded-md p-2 text-slate-800 ${!open &&
              "rotate-[180deg]"}`}
            onClick={() => setOpen(!open)}
            style={{
              backgroundColor: currentColor,
              color: "white"
            }}
          />
        </div>
        <div className="flex gap-x-4 items-center">
          <div
            className={` rounded-md p-2 flex justify-center items-center transform text-2xl drop-shadow-xl ${open &&
              "rotate-[360deg]"}`}
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: currentColor,
              color: "white"
            }} // Adjust width and height as needed
          >
            <LuScanFace
              className={`cursor-pointer text-white text-gray-700 duration-500  ${!open &&
                "rotate-[360deg]"}`}
            />
          </div>
          <h1
            className={`text-gray-700 origin-left font-medium text-xl duration-200 ${!open &&
              "scale-0"}`}
          >
            ClassSyncIn
          </h1>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) =>
            <Link to={Menu.link} style={{ width: "100%" }}>
              <li
                key={index}
                onClick={() => handleClick(Menu.title)}
                className={`flex rounded-md pl-2.5 pr-2 pt-3 pb-2.5 cursor-pointer text-gray-700 ${Menu.title !==
                  selectedMenu &&
                  "hover:bg-gray-300"} text-md drop-shadow-xl items-center gap-x-4 mt-2 
              }`}
                style={{
                  backgroundColor:
                    Menu.title === selectedMenu ? currentColor : ""
                  // Add other styles as needed
                }}
              >
                {open
                  ? <div
                      className="flex items-center"
                      style={{ width: "100%" }}
                    >
                      {/* Apply the icon size class to the icon */}
                      <span
                        className={`${iconSizeClass} mr-2 ${selectedMenu ===
                          Menu.title && "text-white"}`}
                      >
                        {Menu.icon}
                      </span>
                      <span
                        className={`${titleMarginClass} ${!open &&
                          "hidden"} origin-left duration-200 ${selectedMenu ===
                          Menu.title && "text-white"}`}
                      >
                        {Menu.title}
                      </span>
                    </div>
                  : <Tooltip
                      title={Menu.title}
                      placement="right"
                      TransitionComponent={Zoom}
                    >
                      <div
                        className="flex items-center"
                        style={{ width: "100%" }}
                      >
                        {/* Apply the icon size class to the icon */}
                        <span
                          className={`${iconSizeClass} mr-2 ${selectedMenu ===
                            Menu.title && "text-white"}`}
                        >
                          {Menu.icon}
                        </span>
                      </div>
                    </Tooltip>}
              </li>
            </Link>
          )}
        </ul>
        <Tooltip title="Logout" placement="right" TransitionComponent={Zoom}>
          <button
            onClick={handleSettingsClick}
            style={{
              width: "100%",
              backgroundColor: isSettingsSelected ? currentColor : ""
            }}
            className={`flex rounded-md pl-2.5 pr-2 pt-3 pb-2.5 cursor-pointer text-gray-700 ${isSettingsSelected
              ? "text-white"
              : "hover:bg-gray-300"} text-md drop-shadow-xl items-center gap-x-4 mt-2 `}
          >
            <div className="flex items-center">
              <MdLogout style={{ fontSize: "20px" }} />

              <span
                className={`${titleMarginClass} ${!open &&
                  "hidden"} origin-left duration-200`}
                style={{
                  marginLeft: open ? "1.5rem" : "0"
                }}
              >
                Logout
              </span>
            </div>
          </button>
        </Tooltip>

        <LogoutPopup openPopup={openPopup} setOpenPopup={setOpenPopup} />
      </div>
    </div>
  );
};

export default Sidebar;
