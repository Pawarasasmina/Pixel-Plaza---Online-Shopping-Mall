import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const ClientLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 mt-16 ">{children}</div>
      <Footer />
    </div>
  );
};

export default ClientLayout;
