// CheckoutPopup.js
import React, { useState } from "react";

const CheckoutPopup = ({ product, onClose, onConfirm }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("");

  const handleConfirm = () => {
    if (!selectedPaymentMethod || !deliveryOption) {
      alert("Please select both payment method and delivery option.");
      return;
    }
    onConfirm({ selectedPaymentMethod, deliveryOption });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#ff5733]">Confirm Purchase</h2>
        
        {/* Product Info */}
        {product && (
          <div className="mb-4 text-center">
            <h3 className="text-lg font-semibold">{product.name}</h3>
       
          </div>
        )}

        {/* Payment Method Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Payment Method:</label>
          <select
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ff5733] transition duration-300"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>

        {/* Delivery Option Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Delivery Option:</label>
          <select
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-[#ff5733] transition duration-300"
            value={deliveryOption}
            onChange={(e) => setDeliveryOption(e.target.value)}
          >
            <option value="">Select Delivery Option</option>
            <option value="Home Delivery">Home Delivery</option>
            <option value="Store Pickup">Store Pickup</option>
          </select>
        </div>

        {/* Button Container */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-[#28a745] text-white rounded-md mr-2 hover:bg-[#218838] transition duration-300"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500 transition duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPopup;
