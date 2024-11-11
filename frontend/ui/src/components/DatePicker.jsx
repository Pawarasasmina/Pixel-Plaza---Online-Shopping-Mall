// src/components/DatePicker.jsx

import React from "react";
import DatePicker from "react-datepicker"; // Import from your date-picker library
import "react-datepicker/dist/react-datepicker.css"; // Import styles if necessary

const CustomDatePicker = ({ selectedDate, onChange }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      dateFormat="yyyy/MM/dd"
      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#E76F51] focus:ring-[#E76F51] sm:text-sm"
    />
  );
};

export default CustomDatePicker; // Export as default
