import React, { useEffect, useState } from "react";
import axios from "axios";
import "daisyui";
import { HorizontalLine } from "../components/HorizontalLine"; // Assuming you have this component
import { Bar } from "react-chartjs-2"; // Import Chart.js
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable";

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export const Overview = () => {
  const [reports, setReports] = useState([]);
  const [salesView, setSalesView] = useState("daily");
  const [salesData, setSalesData] = useState(null);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const selectedSalesShop = localStorage.getItem("shopId") || "";
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleToggle = (view) => {
    setSalesView(view);
  };

  const handleShowSales = async (type) => {
    setError(null);
    setSuccessMessage(null);
    setLoading(true); // Start loading

    try {
      let response;
      const params = { shopId: selectedSalesShop };

      // Build params based on sales view type
      if (type === "daily") {
        if (!year || !month || !day) {
          setError("Please select a valid year, month, and day.");
          return;
        }
        params.year = year;
        params.month = month;
        params.day = day;

        response = await axios.get(
          "http://localhost:3000/api/sells/dailyIncomeByShop",
          { params }
        );
      } else if (type === "monthly") {
        if (!year || !month) {
          setError("Please select a valid year and month.");
          return;
        }
        params.year = year;
        params.month = month;

        response = await axios.get(
          "http://localhost:3000/api/sells/monthlyIncomeByShop",
          { params }
        );
      } else if (type === "yearly") {
        if (!year) {
          setError("Please select a valid year.");
          return;
        }
        params.year = year;

        response = await axios.get(
          "http://localhost:3000/api/sells/yearlyIncomeByShop",
          { params }
        );
      }

      console.log("Sales data shown:", response.data);
      const incomeData = response.data.data;

      if (incomeData) {
        setSalesData(incomeData);
        setSuccessMessage(response.data.message);
      } else {
        setError("No sales data found.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
      console.error("Error showing sales:", err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Prepare data for the graph
  const chartData = {
    labels: salesData?.salesDetails?.map((item) => item.itemName) || [],
    datasets: [
      {
        label: "Total Sales",
        data: salesData?.salesDetails?.map((item) => item.totalSales) || [],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  const downloadPDF = () => {
    const pdf = new jsPDF();

    // Add title
    pdf.setFontSize(20);
    pdf.text("Sales Report", 10, 10);

    // Add date
    const formattedDate = `${salesData.day || "N/A"} ${
      monthNames[salesData.month - 1]
    } ${salesData.year}`;
    pdf.setFontSize(12);
    pdf.text(`Date: ${formattedDate}`, 10, 20);

    // Add shop ID and total income
    pdf.text(`Shop ID: ${salesData.shopId}`, 10, 30);
    pdf.text(`Total Income: Rs. ${salesData.totalIncome}`, 10, 40);

    // Prepare table
    const tableColumn = ["Item Name", "Price", "Quantity", "Total Sales"];
    const tableRows = salesData.salesDetails.map((item) => [
      item.itemName,
      `Rs. ${item.price.toFixed(2)}`,
      item.quantity,
      `Rs. ${item.totalSales.toFixed(2)}`,
    ]);

    // Add table to PDF
    pdf.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
    });

    // Generate file name based on shop ID and date
    const fileName = `sales_report_${salesData.shopId}_${formattedDate.replace(
      /\s+/g,
      "_"
    )}.pdf`;

    // Save the PDF
    pdf.save(fileName);
  };

  return (
    <div className="flex-1 w-[82vw] bg-[#F4F4F4] p-8">
      <h1 className="font-russo text-[#212529] text-4xl">Sales Overview</h1>
      <HorizontalLine />

      {/* Sales Section */}
      <div className="grid grid-cols-1 gap-8 mt-8">
        <Card
          title={
            salesView === "daily"
              ? "Daily Sales"
              : salesView === "monthly"
              ? "Monthly Sales"
              : "Yearly Sales"
          }
        >
          {/* Mini Navbar for Sales View */}
          <div className="flex space-x-4 mb-4">
            {["daily", "monthly", "yearly"].map((view) => (
              <button
                key={view}
                onClick={() => handleToggle(view)}
                className={`p-2 rounded transition duration-200 ${
                  salesView === view
                    ? "bg-[#E76F51] text-white"
                    : "bg-white text-[#E76F51] hover:bg-[#E76F51] hover:text-white border border-[#E76F51]"
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)} Sales
              </button>
            ))}
          </div>

          {/* Year, Month, Day Dropdowns for Sales Data */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <select
              className="p-2 border border-[#E76F51] rounded"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              {[2021, 2022, 2023, 2024].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>

            {salesView !== "yearly" && (
              <select
                className="p-2 border border-[#E76F51] rounded"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">Select Month</option>
                {monthNames.map((m, index) => (
                  <option key={m} value={index + 1}>
                    {m}
                  </option>
                ))}
              </select>
            )}

            {salesView === "daily" && (
              <select
                className="p-2 border border-[#E76F51] rounded"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="">Select Day</option>
                {Array.from({ length: 31 }, (_, index) => index + 1).map(
                  (d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  )
                )}
              </select>
            )}
          </div>

          {/* Show Sales Button */}
          <div className="flex space-x-4">
            <button
              onClick={() => handleShowSales(salesView)}
              className="p-2 bg-[#5C646C] text-white rounded"
            >
              Show Sales
            </button>
            <button
              onClick={downloadPDF}
              className="p-2 bg-[#E76F51] text-white rounded"
            >
              Download PDF
            </button>
          </div>

          {/* Loading Indicator */}
          {loading && <div className="mt-4 text-blue-500">Loading...</div>}

          {/* Error/Success Message */}
          {error && <div className="text-red-600 mt-4">{error}</div>}
          {successMessage && (
            <div className="text-green-600 mt-4">{successMessage}</div>
          )}

          {/* Display Sales Data */}
          {salesData && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold">
                Shop ID: {salesData.shopId}
              </h3>
              <p>
                Total Income: <strong>Rs. {salesData.totalIncome}</strong>
              </p>
              <p>
                Date: {salesData.day || "N/A"} {monthNames[salesData.month - 1]}{" "}
                {salesData.year}
              </p>

              {/* Sales Details Table */}
              {salesData.salesDetails && (
                <table className="table w-full border-collapse border border-gray-200 mt-4">
                  <thead className="bg-[#E76F51] text-white">
                    <tr>
                      <th className="border border-gray-300 p-2">Item Name</th>
                      <th className="border border-gray-300 p-2">Price</th>
                      <th className="border border-gray-300 p-2">Quantity</th>
                      <th className="border border-gray-300 p-2">
                        Total Sales
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesData.salesDetails.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                      >
                        <td className="border border-gray-300 p-2">
                          {item.itemName}
                        </td>
                        <td className="border border-gray-300 p-2">
                          Rs. {item.price.toFixed(2)}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {item.quantity}
                        </td>
                        <td className="border border-gray-300 p-2">
                          Rs. {item.totalSales.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </Card>

        {/* Bar Chart */}
        <Card title="Sales Graph">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: "top",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const label = context.dataset.label || "";
                      const value = context.raw;
                      return `${label}: Rs. ${value}`;
                    },
                  },
                },
              },
            }}
          />
        </Card>
      </div>
    </div>
  );
};

const Card = ({ title, children }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="font-semibold text-xl mb-4">{title}</h2>
      {children}
    </div>
  );
};
