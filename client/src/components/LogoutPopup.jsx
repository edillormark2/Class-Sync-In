import React, { useState, useEffect } from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useStateContext } from "../contexts/ContextProvider";
import { useNavigate } from "react-router-dom";

const LogoutPopup = ({ openPopup, setOpenPopup }) => {
  const { currentColor, logout } = useStateContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpenPopup(false); // Close the popup after successful logout
    navigate("/login"); // Redirect to '/login' after logout

    // Clear history after logout
    setTimeout(() => {
      window.history.replaceState(null, "", "/login");
    }, 0);
  };
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      window.history.replaceState(null, "", "/login");
    }
  }, []);

  return (
    <div className="bg-white dark-bg-[#42464D]">
      <Modal open={openPopup} onClose={() => setOpenPopup(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle style={{ justifyContent: "center" }}>
            <WarningRoundedIcon />
            Confirm Logout
          </DialogTitle>
          <Divider />
          <DialogContent className="md-max-sm-flex">
            Are you sure you want to log out?
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              variant="solid"
              onClick={handleLogout}
              style={{
                backgroundColor: currentColor,
                color: "white"
              }}
            >
              Yes
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenPopup(false)}
            >
              No
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default LogoutPopup;
