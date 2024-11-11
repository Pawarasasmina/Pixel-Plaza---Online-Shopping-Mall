import React, { useState } from "react";
import "../styles/CardPopup.css";

const CardPopup = ({ isOpen, onClose, onCardSelect }) => {
  const [cardDetails, setCardDetails] = useState({
    number: "",
    holder: "",
    expiry: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleCardSelection = () => {
    onCardSelect(cardDetails); // Pass card details back to CartPage
  };

  return isOpen ? (
    <div className="card-popup">
      <div className="card-popup-content">
        <h2>Select or Add Card</h2>
        <label>
          Card Number:
          <input
            type="text"
            name="number"
            value={cardDetails.number}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Card Holder:
          <input
            type="text"
            name="holder"
            value={cardDetails.holder}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Expiry Date:
          <input
            type="text"
            name="expiry"
            value={cardDetails.expiry}
            onChange={handleInputChange}
          />
        </label>
        <label>
          CVV:
          <input
            type="text"
            name="cvv"
            value={cardDetails.cvv}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={handleCardSelection}>Select Card</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  ) : null;
};

export default CardPopup;
