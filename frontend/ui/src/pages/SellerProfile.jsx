import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineMail, AiOutlinePhone, AiOutlineIdcard } from "react-icons/ai";
import { MdStoreMallDirectory } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Modal from "react-modal";

// Custom styles for the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
  },
};

export const SellerProfile = () => {
  const [shopDetails, setShopDetails] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [updatedShop, setUpdatedShop] = useState({
    shopKeeperPhoto: "",
    description: "",
    contactInfo: "",
    category: "",
  });
  const shopID = localStorage.getItem("shopId");
  const userID = localStorage.getItem("userId");

  useEffect(() => {
    const fetchShopDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/shops/getByShopID/${shopID}`
        );
        setShopDetails(response.data);
      } catch (error) {
        console.error("Error fetching shop details:", error);
      }
    };

    const fetchSellerDetails = async (userId) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/profile/${userId}`
        );
        setSellerDetails(response.data);
      } catch (error) {
        console.error(
          "Error fetching user profile by ID:",
          error.response?.data || error.message
        );
      }
    };

    fetchShopDetails();
    if (userID) {
      fetchSellerDetails(userID);
    }
  }, [shopID, userID]);

  const openModal = () => {
    setUpdatedShop({
      shopKeeperPhoto: shopDetails.shopKeeperPhoto || "",
      description: shopDetails.description || "",
      contactInfo: sellerDetails.phone || "",
      category: shopDetails.category || "",
    });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedShop((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/shops/updateByShopID/${shopID}`,
        updatedShop
      );
      setShopDetails(response.data);
      closeModal();
    } catch (error) {
      console.error("Error updating shop details:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full lg:w-[82vw] bg-[#F4F4F4] p-8">
      <h1 className="font-russo text-[#212529] text-4xl mb-6">Profile</h1>

      {/* Store Details Section */}
      {shopDetails ? (
        <div className="relative w-full lg:w-[75vw] mt-8 p-6 bg-white shadow-lg rounded-lg">
          <div className="absolute top-0 left-0 w-full h-12 flex items-center justify-center bg-[#E76F51] rounded-t-lg">
            <h2 className="font-russo text-white text-2xl">Store Details</h2>
          </div>
          <div className="flex flex-col lg:flex-row mt-12 gap-8">
            <div className="lg:w-1/3 p-4 bg-gray-200 rounded-lg transition-transform transform hover:scale-105 shadow-lg relative">
              {/* Store Name Label */}
              <div className="mb-4">
                <label className="block text-xl font-semibold mb-2">
                  Store Name:
                </label>
                <h2 className="font-russo text-[#212529] text-3xl mb-6">
                  {shopDetails.shopName}
                </h2>
              </div>

              {/* Store Logo Section */}
              <div className="h-40 bg-gray-300 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                {shopDetails.shopKeeperPhoto ? (
                  <img
                    src={shopDetails.shopKeeperPhoto}
                    alt="Shop Keeper"
                    className="w-32 h-32 rounded-full border-4 border-[#E76F51] shadow-md transform transition-transform hover:scale-110"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg font-semibold">
                      No Photo
                    </span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-lg">
                  <MdStoreMallDirectory size={24} className="text-[#E76F51]" />
                </div>
              </div>

              <p className="text-center font-semibold text-gray-700">
                Store Logo
              </p>
            </div>

            <div className="lg:w-2/3 pl-0 lg:pl-8">
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Shop Keeper Name:
                </label>
                <p className="text-gray-500">{shopDetails.shopKeeperName}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Assign Date:
                </label>
                <p className="text-gray-500">
                  {new Date(shopDetails.assignDate).toLocaleDateString()}
                </p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Value:
                </label>
                <p className="text-gray-500">{shopDetails.Value}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Description:
                </label>
                <p className="text-gray-500">{shopDetails.description}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Contact Information:
                </label>
                <p className="text-gray-500 flex items-center gap-2">
                  <AiOutlineMail className="text-lg text-[#E76F51]" />
                  <span>{updatedShop.contactInfo || "store@example.com"}</span>
                </p>
                <p className="text-gray-500 flex items-center gap-2">
                  <AiOutlinePhone className="text-lg text-[#E76F51]" />
                  <span>{updatedShop.contactInfo || "+1 (555) 555-5555"}</span>
                </p>
              </div>
              <button
                onClick={openModal}
                className="mt-4 bg-[#E76F51] text-white py-2 px-4 rounded-lg hover:bg-[#d65b4f] transition"
              >
                Edit Info
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton height={400} />
      )}

      {/* Seller Details Section */}
      {sellerDetails ? (
        <div className="relative w-full lg:w-[75vw] mt-8 p-6 bg-white shadow-lg rounded-lg">
          <div className="absolute top-0 left-0 w-full h-12 flex items-center justify-center bg-[#E76F51] rounded-t-lg">
            <h2 className="font-russo text-white text-2xl">Seller Details</h2>
          </div>
          <div className="flex flex-col mt-12 gap-4">
            <DetailCard label="Name" value={sellerDetails.name} />
            <DetailCard
              label="Email"
              value={sellerDetails.email}
              icon={<AiOutlineMail />}
            />
            <DetailCard
              label="Phone"
              value={sellerDetails.phone}
              icon={<AiOutlinePhone />}
            />
            <DetailCard
              label="User ID"
              value={sellerDetails.id}
              icon={<AiOutlineIdcard />}
            />
            <DetailCard
              label="User Level"
              value={sellerDetails.userLevel === 1 ? "Seller" : "Other"}
            />
            <DetailCard label="Shop ID" value={sellerDetails.shopId} />
          </div>
        </div>
      ) : (
        <Skeleton count={5} height={100} />
      )}

      {/* Modal for Updating Shop Info */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2 className="text-lg font-semibold mb-4">Edit Shop Info</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="shopKeeperPhoto"
            placeholder="Shop Keeper Photo URL"
            value={updatedShop.shopKeeperPhoto}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={updatedShop.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
            rows="3"
          />
          <input
            type="text"
            name="contactInfo"
            placeholder="Contact Information"
            value={updatedShop.contactInfo}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={updatedShop.category}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          <button
            type="submit"
            className="mt-4 bg-[#E76F51] text-white py-2 rounded-lg hover:bg-[#d65b4f] transition"
          >
            Update Shop Info
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="mt-2 border border-gray-400 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

// Helper component for displaying details
const DetailCard = ({ label, value, icon }) => (
  <div className="flex items-center justify-between border-b py-2">
    <span className="font-semibold text-gray-700">{label}:</span>
    <span className="text-gray-500 flex items-center gap-2">
      {icon} {value}
    </span>
  </div>
);

export default SellerProfile;
