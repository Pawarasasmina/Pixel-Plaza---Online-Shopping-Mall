import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { AiOutlineDelete } from "react-icons/ai";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { HorizontalLine } from "../components/HorizontalLine"; // Assuming you have this component

export const AddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [manufacturedDate, setManufacturedDate] = useState(null);
  const [images, setImages] = useState([]);

  const addColor = () => setColors([...colors, ""]);
  const handleColorChange = (index, value) => {
    const updatedColors = [...colors];
    updatedColors[index] = value;
    setColors(updatedColors);
  };
  const removeColor = (index) =>
    setColors(colors.filter((_, i) => i !== index));

  const addSize = () => setSizes([...sizes, ""]);
  const handleSizeChange = (index, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = value;
    setSizes(updatedSizes);
  };
  const removeSize = (index) => setSizes(sizes.filter((_, i) => i !== index));

  const addImage = () => setImages([...images, ""]);
  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };
  const removeImage = (index) =>
    setImages(images.filter((_, i) => i !== index));

  const validateForm = () => name && price && category && description;

  const submitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill in all required fields.");
      return;
    }

    // Retrieve the shopID from localStorage
    const shopID = localStorage.getItem("shopId");

    // Directly use colors, sizes, and images as arrays
    const productData = {
      name,
      price,
      colors: colors.filter((item) => item !== ""), // Remove empty values if necessary
      sizes: sizes.filter((item) => item !== ""), // Remove empty values if necessary
      category,
      description,
      manufacturedDate: manufacturedDate
        ? manufacturedDate.toISOString()
        : null,
      images: images.filter((item) => item !== ""), // Remove empty values if necessary
      shopID, // Include shopID in the product data
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/products",
        productData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        alert("Product added successfully!");
        navigate("/allProducts");
        resetForm();
      }
    } catch (error) {
      console.error("Failed to add product:", error.response || error.message);
      alert(
        `An error occurred while adding the product: ${
          error.response?.data?.msg || error.message
        }`
      );
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setColors([]);
    setSizes([]);
    setCategory("");
    setDescription("");
    setManufacturedDate(null);
    setImages([]);
  };

  return (
    <div className="flex-1 w-[82VW] bg-[#F4F4F4] p-8">
      <h1 className="font-russo text-[#212529] text-4xl mb-4">
        Add New Product
      </h1>
      <HorizontalLine />
      <motion.div
        className="mt-8 p-8 bg-white rounded-lg shadow-lg border border-[#E76F51]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <form className="space-y-6" onSubmit={submitForm}>
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:border-[#E76F51] focus:ring-[#E76F51] sm:text-sm"
              required
            />
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Price:
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:border-[#E76F51] focus:ring-[#E76F51] sm:text-sm"
              required
            />
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Color(s):
            </label>
            {colors.map((color, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={color}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:border-[#E76F51] focus:ring-[#E76F51] sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete className="text-xl" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addColor}
              className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
            >
              <HiOutlinePlusCircle className="text-2xl" />
              <span>Add Color</span>
            </button>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Size(s):
            </label>
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={size}
                  onChange={(e) => handleSizeChange(index, e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:border-[#E76F51] focus:ring-[#E76F51] sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete className="text-xl" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSize}
              className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
            >
              <HiOutlinePlusCircle className="text-2xl" />
              <span>Add Size</span>
            </button>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:border-[#E76F51] focus:ring-[#E76F51] sm:text-sm"
              required
            >
              <option value="">Select Category</option>
              <option value="Fashion">Fashion</option>
              <option value="Electronics">Electronics</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Sport & Outdoor">Sport & Outdoor</option>
              <option value="Groceries">Groceries</option>
              <option value="Gaming & Entertainment">
                Gaming & Entertainment
              </option>
              <option value="Toys">Toys</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:border-[#E76F51] focus:ring-[#E76F51] sm:text-sm"
              required
            />
          </div>

          {/* Manufactured Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Manufactured Date:
            </label>
            <DatePicker
              selected={manufacturedDate}
              onChange={(date) => setManufacturedDate(date)}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:border-[#E76F51] focus:ring-[#E76F51] sm:text-sm"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image URL(s):
            </label>
            {images.map((image, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 p-3 text-gray-800 shadow-sm focus:border-[#E76F51] focus:ring-[#E76F51] sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <AiOutlineDelete className="text-xl" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
            >
              <HiOutlinePlusCircle className="text-2xl" />
              <span>Add Image</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#E76F51] text-white rounded-md py-2 hover:bg-[#d65a44]"
          >
            Add Product
          </button>
        </form>
      </motion.div>
    </div>
  );
};
