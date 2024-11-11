import React, { useState } from "react";
import "../styles/UpdatePopup.css"; // Create styles for this popup

const UpdatePopup = ({ isOpen, onClose, item, onUpdate }) => {
  const [updatedColor, setUpdatedColor] = useState(item?.color || "");
  const [updatedSize, setUpdatedSize] = useState(item?.size || "");
  const [updatedQuantity, setUpdatedQuantity] = useState(item?.count || 1);

  if (!isOpen) return null;

  const handleSave = () => {
    if (item) {
      onUpdate({
        ...item,
        color: updatedColor,
        size: updatedSize,
        count: updatedQuantity,
      });
    }
  };

  return (
    <div className="update-popup-overlay">
      <div className="update-popup">
        <h2>Update Item</h2>
        <label>
          Color:
          <input
            type="text"
            value={updatedColor}
            onChange={(e) => setUpdatedColor(e.target.value)}
          />
        </label>
        <label>
          Size:
          <input
            type="text"
            value={updatedSize}
            onChange={(e) => setUpdatedSize(e.target.value)}
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            value={updatedQuantity}
            min="1"
            onChange={(e) => setUpdatedQuantity(e.target.value)}
          />
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default UpdatePopup;
