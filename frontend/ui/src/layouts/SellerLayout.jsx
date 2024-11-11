import React from "react";
import { Sidebar } from "../components/SideBar";

const SellerLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">{children}</div>
    </div>
  );
};

export default SellerLayout;
