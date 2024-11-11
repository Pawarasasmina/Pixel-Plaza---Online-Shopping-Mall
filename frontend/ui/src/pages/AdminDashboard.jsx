import React from "react";
import { HorizontalLine } from "../components/HorizontalLine";
import { HiOutlinePlusCircle } from "react-icons/hi";

export const AdminDashboard = () => {
  return (
    <div className="flex-1 w-[98vw] bg-light p-8">
      <h1 className="font-russo text-dark text-4xl">Admin Dashboard</h1>
      <HorizontalLine />
      <div className="grid grid-cols-2 gap-8 mt-8">
        <Card title="Manage Admins" design="default">
          <button className="bg-secondary text-light py-2 px-4 rounded-full">
            View All Admins
          </button>
        </Card>
        <Card title="Manage Sellers" design="default">
          <button className="bg-secondary text-light py-2 px-4 rounded-full">
            View All Sellers
          </button>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-8 mt-8">
        <Card
          title="Add Admin"
          design="default"
          actions={<HiOutlinePlusCircle className="text-primary text-4xl" />}
        />
        <Card
          title="Add Seller"
          design="default"
          actions={<HiOutlinePlusCircle className="text-primary text-4xl" />}
        />
      </div>
    </div>
  );
};

const Card = ({ title, children, actions, design }) => {
  const cardStyles = {
    default: "bg-light border-primary border-4 rounded-lg",
  };

  const headerStyles = {
    default: "bg-primary rounded-tl-lg",
  };

  return (
    <div className={`relative p-6 ${cardStyles[design]}`}>
      <div
        className={`absolute top-0 left-0 w-1/2 h-12 flex items-center justify-center ${headerStyles[design]}`}
      >
        <h2 className="font-russo text-white text-center">{title}</h2>
      </div>
      <div className="mt-12 rounded-lg overflow-hidden">
        {children || <div className="bg-gray-300 h-24 rounded-lg"></div>}
      </div>
      {actions && (
        <div className="absolute top-0 right-0 mt-2 mr-2">{actions}</div>
      )}
    </div>
  );
};
