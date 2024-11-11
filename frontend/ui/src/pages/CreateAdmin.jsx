import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CreateAdmin = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const validateForm = () => name && email && password && phone;

  const submitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    const adminData = { name, email, password, phone };
    const token = localStorage.getItem("token"); // Get token from local storage

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/create-admin",
        adminData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );

      if (response.status === 201) {
        alert("Admin created successfully!");
        navigate("/allAdmins");
        resetForm();
      }
    } catch (error) {
      console.error("Failed to create admin:", error.response || error.message);
      alert(
        `An error occurred while creating the admin: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
  };

  return (
    <div className="flex-1 w-[100vw] bg-[#F4F4F4] p-8">
      <h1 className="font-russo text-[#212529] text-4xl mb-4">
        Create New Admin
      </h1>
      <motion.div
        className="mt-8 p-8 bg-white rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form className="space-y-6" onSubmit={submitForm}>
          {/* Admin Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Admin Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm"
              required
            />
          </div>

          {/* Admin Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Admin Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm"
              required
            />
          </div>

          {/* Admin Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Admin Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm"
              required
            />
          </div>

          {/* Admin Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Admin Phone:
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-[#E76F51] text-white p-3 rounded-md hover:bg-[#D65E4D]"
          >
            Create Admin
          </button>
        </form>
      </motion.div>
    </div>
  );
};
