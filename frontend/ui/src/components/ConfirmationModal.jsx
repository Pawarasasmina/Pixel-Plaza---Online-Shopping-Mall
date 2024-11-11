import React from "react";
import "../styles/ConfirmationModal.css";

const ConfirmationModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        <p>{message}</p>
        <div className="confirmation-buttons">
          <button onClick={onConfirm} className="confirm-btn">
            Yes
          </button>
          <button onClick={onCancel} className="cancel-btn">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
