import React from "react";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const DeleteStudent = props => {
  const { currentColor } = useStateContext();
  const { openPopup, setOpenPopup, studentNo } = props; // Ensure studentNo is passed from props
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/deleteStudent/${studentNo}`
      ); // Replace URL with your delete API endpoint
      if (response.status === 200) {
        toast.success("Student deleted");
        props.onStudentDeleted();
        setOpenPopup(false); // Close the popup after successful deletion
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error("Error deleting student record");
    }
  };

  return (
    <div className="bg-white dark-bg-[#42464D]">
      <Modal open={openPopup}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle style={{ justifyContent: "center" }}>
            <WarningRoundedIcon />
            Confirmation
          </DialogTitle>
          <Divider />
          <DialogContent className="md-max-sm-flex">
            Are you sure you want to delete this?
          </DialogContent>
          <DialogActions style={{ justifyContent: "center" }}>
            <Button
              variant="solid"
              onClick={handleDelete}
              style={{
                backgroundColor: "#DE3163",
                color: "white"
              }}
            >
              Delete
            </Button>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpenPopup(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </div>
  );
};

export default DeleteStudent;
