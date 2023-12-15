import React, { createContext, useContext, useState, useEffect } from "react";
import { createBrowserHistory } from "history";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [currentColor, setCurrentColor] = useState("#1A97F5");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const history = createBrowserHistory(); // Create a browser history object

  const login = userData => {
    localStorage.setItem("isLoggedIn", "true");
    // Store user-specific data if needed
    // localStorage.setItem("userData", JSON.stringify(userData));
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    history.replace("/login"); // Replace current URL with login page upon logout
  };

  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <StateContext.Provider
      value={{
        currentColor,
        isLoggedIn,
        setIsLoggedIn,
        logout,
        login
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
