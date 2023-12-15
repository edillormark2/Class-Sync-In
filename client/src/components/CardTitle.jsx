import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import "../App.css"; // Import CSS file for additional styling

const CardTitle = ({ title }) => {
  const { currentColor, currentMode } = useStateContext();

  return (
    <div>
      <h5 className="mb-2 relative font-bold">
        {title}
        <span className="h5-after" style={{ backgroundColor: currentColor }} />
      </h5>
    </div>
  );
};

export default CardTitle;
