import React from "react";
import "../styles/CustomAlert.css";

const CustomAlert = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-modal">
        <p>{message}</p>
        <button onClick={onClose} className="alert-close-btn">
          OK
        </button>
      </div>
    </div>
  );
};

export default CustomAlert;
