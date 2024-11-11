import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CreateSeller = () => {
  const navigate = useNavigate();

  // Seller form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [shopId, setShopId] = useState("");

  // Shop data state
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);

  // Fetch shops with shop names from the backend
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/shops/getShopsWithName"
        );
        setShops(response.data);
      } catch (error) {
        console.error("Failed to fetch shops:", error);
      }
    };
    fetchShops();
  }, []);

  const validateForm = () => name && email && password && phone && shopId;

  const submitForm = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    // Prepare seller data with the selected shop's ID
    const sellerData = {
      name,
      email,
      password,
      phone,
      shopId: selectedShop?.shopID, // Ensure the shopID is taken from the selected shop
    };

    const token = localStorage.getItem("token");

    try {
      // First, create the seller with the shopId included
      const sellerResponse = await axios.post(
        "http://localhost:3000/api/users/add-seller",
        sellerData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (sellerResponse.status === 201) {
        // After creating the seller, update the shop's shopKeeperName using the selected shop's floorID
        const updateShopData = { shopKeeperName: name };
        const shopResponse = await axios.put(
          `http://localhost:3000/api/shops/update/${selectedShop.floorID}`,
          updateShopData
        );

        if (shopResponse.status === 200) {
          alert("Seller and shop updated successfully!");
          resetForm();
          navigate("/createSeller"); // Redirect to the allSellers page
        } else {
          throw new Error("Failed to update the shop's shopKeeperName.");
        }
      }
    } catch (error) {
      console.error(
        "Failed to add seller or update shop:",
        error.response || error.message
      );
      alert(
        `An error occurred: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setShopId("");
    setSelectedShop(null); // Clear selected shop details
  };

  const handleShopChange = (e) => {
    const selectedId = e.target.value;
    setShopId(selectedId);

    // Find selected shop details
    const shop = shops.find((shop) => shop._id === selectedId);
    setSelectedShop(shop || null);
  };

  return (
    <div className="flex w-[100vw] bg-[#F4F4F4] p-8 space-x-8">
      {/* Left Section - Form */}
      <div className="w-1/2">
        <h1 className="font-russo text-[#212529] text-4xl mb-4">
          Create New Seller
        </h1>
        <motion.div
          className="mt-8 p-8 bg-white rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form className="space-y-6" onSubmit={submitForm}>
            {/* Seller Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Seller Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm"
                required
              />
            </div>

            {/* Seller Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Seller Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm"
                required
              />
            </div>

            {/* Seller Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Seller Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm"
                required
              />
            </div>

            {/* Seller Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Seller Phone:
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm"
                required
              />
            </div>

            {/* Shop ID Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Shop:
              </label>
              <select
                value={shopId}
                onChange={handleShopChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm"
                required
              >
                <option value="" disabled>
                  Select a shop
                </option>
                {shops.map((shop) => (
                  <option key={shop._id} value={shop._id}>
                    {shop.shopID} - {shop.shopName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-[#E76F51] text-white p-3 rounded-md hover:bg-[#D65E4D]"
            >
              Create Seller
            </button>
          </form>
        </motion.div>
      </div>

      {/* Right Section - Display Selected Shop Details */}
      <div className="w-1/2 bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800">Shop Details</h2>
        {selectedShop ? (
          <div className="mt-4 space-y-4">
            <p>
              <strong>Shop Name:</strong> {selectedShop.shopName}
            </p>
            <p>
              <strong>Floor ID:</strong> {selectedShop.floorID}
            </p>
            <p>
              <strong>Shop ID:</strong> {selectedShop.shopID}
            </p>
            <p>
              <strong>Shopkeeper Name:</strong> {selectedShop.shopKeeperName}
            </p>
            <p>
              <strong>Assigned Date:</strong>{" "}
              {new Date(selectedShop.assignDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Value:</strong> {selectedShop.Value}
            </p>
            <p>
              <strong>Description:</strong> {selectedShop.description}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No shop selected.</p>
        )}
      </div>
    </div>
  );
};
