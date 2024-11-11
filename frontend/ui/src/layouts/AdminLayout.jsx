import React from "react";
import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminNavbar />
      <div className="flex-1 mt-20">{children}</div>
    </div>
  );
};

export default AdminLayout;
