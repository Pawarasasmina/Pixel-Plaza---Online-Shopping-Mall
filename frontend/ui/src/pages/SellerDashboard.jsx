import React from "react";
import Sidebar from "../components/SideBar"; // Ensure the path is correct

const SellerDashboard = ({
  handleAddProduct,
  handleAddPromotion,
  handleViewStocks,
}) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        handleAddProduct={handleAddProduct}
        handleAddPromotion={handleAddPromotion}
        handleViewStocks={handleViewStocks}
      />

      {/* Main Content Area */}
      <div
        className="flex-1 w-[80vw] bg-white border-l-4 border-sidebar-color overflow-hidden" // Prevent scrollbars
        style={{ width: "calc(100vw - 16rem)", height: "100vh" }} // Ensure it fits correctly
      >
        <main className="p-8 h-full overflow-hidden">
          <h1 className="text-2xl font-bold">Overview</h1>
          {/* More content can be added here */}
        </main>
      </div>
    </div>
  );
};

export default SellerDashboard;
