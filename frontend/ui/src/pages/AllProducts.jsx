import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiOutlinePlusCircle, HiOutlineFilter } from "react-icons/hi";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { HorizontalLine } from "../components/HorizontalLine";
import { motion } from "framer-motion";
import { Dialog } from "@headlessui/react";
import ImageCarousel from "../components/ImageCarousel"; // Adjust import path as needed
import { useNavigate } from "react-router-dom";

export const AllProducts = () => {
  const shopID = localStorage.getItem("shopId"); // Get shopID from localStorage
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/shop/${shopID}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [shopID]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/products/${productToDelete}` // Using custom id
      );
      setProducts(
        (prevProducts) =>
          prevProducts.filter((product) => product._id !== productToDelete) // Filter based on _id
      );
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Failed to delete product:", error.response?.data || error);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/products/${selectedProduct.id}`, // Ensure correct ID is used
        selectedProduct
      );
      const updatedProduct = response.data.product; // Assuming your API returns the updated product

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
      setShowEditModal(false);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const handleShowDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 w-[82vw] bg-[#F4F4F4] p-8">
      <h1 className="font-russo text-[#212529] text-4xl text-center mb-4">
        Products
      </h1>
      <HorizontalLine />
      <div className="relative mt-8 p-6 bg-white border-[#E76F51] border-4 rounded-lg shadow-lg">
        <div className="absolute top-0 left-0 bg-[#E76F51] w-full h-12 flex items-center justify-center rounded-t-lg">
          <h2 className="font-russo text-white text-2xl">All Products</h2>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 mb-6">
          <div className="flex space-x-4 mb-4 sm:mb-0">
            {/* Add Product Button */}
            <button
              onClick={() => navigate("/addproduct")}
              className="flex items-center bg-[#E76F51] text-white px-4 py-2 rounded-lg shadow-lg hover:bg-[#D64F3D] transition-transform duration-300 transform hover:scale-105"
            >
              <HiOutlinePlusCircle className="mr-2 text-xl" />
              <span className="font-semibold">Add Product</span>
            </button>

            {/* Filter Button */}
            <button className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-200 transition-colors duration-300">
              <HiOutlineFilter className="mr-2 text-lg" />
              <span className="font-semibold">Filter</span>
            </button>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for products..."
            className="input input-bordered rounded-lg w-full sm:w-1/3 shadow-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#E76F51] transition-all duration-300"
          />
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="p-4 bg-white rounded-lg shadow-lg border border-[#E76F51] hover:shadow-xl transition-shadow duration-300 ease-in-out hover:scale-105"
            >
              <div className="relative h-40 bg-gray-300 rounded-lg overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity duration-200"
                    onClick={() => handleShowDetails(product)}
                  />
                ) : (
                  <div className="h-full bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                    No Images Available
                  </div>
                )}
              </div>
              <h3 className="text-center mb-4 text-xl font-semibold text-[#212529]">
                {product.name}
              </h3>
              <p className="text-center text-[#E76F51] font-bold">
                Rs. {product.price}
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(product)}
                  className="btn bg-[#E76F51] text-white flex items-center space-x-2 px-4 py-2 rounded-md shadow-md hover:bg-[#D64F3D] transition-colors"
                >
                  <AiOutlineEdit /> <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setProductToDelete(product._id);
                    setShowConfirmModal(true);
                  }}
                  className="btn bg-red-500 text-white flex items-center space-x-2 px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-colors"
                >
                  <AiOutlineDelete /> <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Product Details Modal */}
      <Dialog
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-black/60 to-gray-800/60"
      >
        <Dialog.Panel className="bg-white border-4 border-[#E76F51] p-6 rounded-xl shadow-2xl w-full max-w-2xl font-sans relative overflow-hidden transition-transform transform hover:scale-105">
          <button
            onClick={() => setShowDetailModal(false)}
            className="absolute top-3 right-3 p-2 bg-[#E76F51] text-white rounded-full shadow-lg hover:bg-[#D64F3D] transition-transform transform hover:rotate-90"
          >
            ✕
          </button>

          <div className="flex flex-col sm:flex-row items-center">
            <div className="flex-shrink-0 w-full sm:w-1/2 mb-6 sm:mb-0">
              {selectedProduct?.images && selectedProduct.images.length > 0 ? (
                <ImageCarousel images={selectedProduct.images} />
              ) : (
                <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg">
                  No Images Available
                </div>
              )}
            </div>

            <div className="flex-1 sm:pl-6">
              <Dialog.Title className="text-4xl font-extrabold text-[#212529] mb-4 tracking-wide">
                {selectedProduct?.name}
              </Dialog.Title>
              <div className="space-y-4">
                {/* Price */}
                <div className="flex items-center">
                  <span className="bg-[#E76F51] text-white rounded-lg px-3 py-1 mr-2 text-sm font-medium">
                    Price:
                  </span>
                  <span className="text-2xl font-bold text-[#E76F51]">
                    Rs. {selectedProduct?.price}
                  </span>
                </div>

                {/* Category */}
                <div className="flex items-center">
                  <span className="bg-[#E76F51] text-white rounded-lg px-3 py-1 mr-2 text-sm font-medium">
                    Category:
                  </span>
                  <span className="text-lg text-gray-700">
                    {selectedProduct?.category || "No category specified"}
                  </span>
                </div>

                {/* Manufactured Date */}
                <div className="flex items-center">
                  <span className="bg-[#E76F51] text-white rounded-lg px-3 py-1 mr-2 text-sm font-medium">
                    Manufactured Date:
                  </span>
                  <span className="text-lg text-gray-700">
                    {selectedProduct?.manufacturedDate
                      ? new Date(
                          selectedProduct.manufacturedDate
                        ).toLocaleDateString()
                      : "No date available"}
                  </span>
                </div>

                {/* Colors */}
                <div className="flex items-center">
                  <span className="bg-[#E76F51] text-white rounded-lg px-3 py-1 mr-2 text-sm font-medium">
                    Available Colors:
                  </span>
                  <span className="text-lg text-gray-700">
                    {selectedProduct?.colors?.join(", ") ||
                      "No colors available"}
                  </span>
                </div>

                {/* Sizes */}
                <div className="flex items-center">
                  <span className="bg-[#E76F51] text-white rounded-lg px-3 py-1 mr-2 text-sm font-medium">
                    Available Sizes:
                  </span>
                  <span className="text-lg text-gray-700">
                    {selectedProduct?.sizes?.join(", ") || "No sizes available"}
                  </span>
                </div>

                {/* Description */}
                <div className="flex items-start">
                  <span className="bg-[#E76F51] text-white rounded-lg px-3 py-1 mr-2 text-sm font-medium">
                    Description:
                  </span>
                  <p className="text-gray-700 text-base leading-relaxed">
                    {selectedProduct?.description || "No description available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Confirm Deletion
          </Dialog.Title>
          <p>Are you sure you want to delete this product?</p>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="btn bg-gray-300 text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="btn bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Edit Product
          </Dialog.Title>
          <form>
            <label className="block mb-2">
              Product Name:
              <input
                type="text"
                value={selectedProduct?.name || ""}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
                className="input input-bordered w-full rounded-md shadow-md mt-1"
              />
            </label>
            <label className="block mb-2">
              Product Price:
              <input
                type="number"
                value={selectedProduct?.price || ""}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    price: e.target.value,
                  })
                }
                className="input input-bordered w-full rounded-md shadow-md mt-1"
              />
            </label>
            <label className="block mb-2">
              Description:
              <textarea
                value={selectedProduct?.description || ""}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    description: e.target.value,
                  })
                }
                className="textarea textarea-bordered w-full rounded-md shadow-md mt-1"
              ></textarea>
            </label>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="btn bg-gray-300 text-black px-4 py-2 rounded-md shadow-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpdateProduct}
                className="btn bg-[#E76F51] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#D64F3D] transition-colors"
              >
                Update Product
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};
