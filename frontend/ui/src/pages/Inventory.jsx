import React, { useState, useEffect } from "react";
import axios from "axios";
import { HorizontalLine } from "../components/HorizontalLine";
import { motion } from "framer-motion";
import { AiOutlineSearch, AiOutlinePlusCircle } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { HiOutlineTag } from "react-icons/hi";

export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showPromotionModal, setShowPromotionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [restockQuantity, setRestockQuantity] = useState(0);
  const [selectedPromotion, setSelectedPromotion] = useState("");

  const shopID = localStorage.getItem("shopId"); // Fetch shopID from local storage

  useEffect(() => {
    const fetchProducts = async () => {
      if (!shopID) {
        console.error("shopID is null. Cannot fetch products.");
        return; // Prevent fetching if shopID is null
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/products/shop/${shopID}`
        ); // Fetch products by shopID
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    const fetchPromotions = async () => {
      if (!shopID) {
        console.error("shopID is null. Cannot fetch promotions.");
        return; // Prevent fetching if shopID is null
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/promotions/shop/${shopID}`
        ); // Fetch promotions by shopID
        const ongoingPromotions = response.data.filter((promo) => {
          const now = new Date();
          return (
            new Date(promo.startDate) <= now && new Date(promo.endDate) >= now
          );
        });
        setPromotions(ongoingPromotions);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchProducts();
    fetchPromotions();
  }, [shopID]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRestock = async () => {
    try {
      await axios.put(
        `http://localhost:3000/api/products/${selectedProduct.id}`,
        { stock: selectedProduct.stock + restockQuantity }
      );
      setProducts(
        products.map((product) =>
          product._id === selectedProduct._id
            ? { ...product, stock: product.stock + restockQuantity }
            : product
        )
      );
      setRestockQuantity(0);
      setShowRestockModal(false);
    } catch (error) {
      console.error("Failed to restock product:", error);
    }
  };

  const handleApplyPromotion = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/products/applyPromotion/${selectedProduct.id}`,
        { promotionId: selectedPromotion }
      );

      const updatedProduct = response.data.product;
      setProducts(
        products.map((product) =>
          product._id === updatedProduct.id ? updatedProduct : product
        )
      );
      setSelectedPromotion("");
      setShowPromotionModal(false);
    } catch (error) {
      // Log the error response
      console.error(
        "Failed to apply promotion:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleRemovePromotion = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/api/products/removePromotion/${selectedProduct.id}`
      );

      const updatedProduct = response.data.product;
      setProducts(
        products.map((product) =>
          product._id === updatedProduct._id ? updatedProduct : product
        )
      );
      setShowPromotionModal(false);
    } catch (error) {
      console.error("Failed to remove promotion:", error);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPromotionDetails = (promotionId) => {
    const promotion = promotions.find((promo) => promo._id === promotionId);
    return promotion
      ? `${promotion.name} - ${promotion.discount}%`
      : "No Promotion";
  };

  return (
    <div className="flex-1 w-[82vw] bg-[#F4F4F4] p-8">
      <h1 className="font-russo text-[#212529] text-4xl text-center mb-4">
        Inventory
      </h1>
      <HorizontalLine />
      <div className="relative mt-8 p-6 bg-white border-[#E76F51] border-4 rounded-lg shadow-lg">
        <div className="absolute top-0 left-0 bg-[#E76F51] w-full h-12 flex items-center justify-center rounded-t-lg">
          <h2 className="font-russo text-white text-2xl">Product Inventory</h2>
        </div>
        <div className="flex justify-between items-center mt-12 mb-4">
          <button className="btn bg-[#E76F51] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#D64F3D] transition-colors">
            <AiOutlinePlusCircle className="mr-2" /> Add Product
          </button>
          <div className="relative w-1/3">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for products..."
              className="input input-bordered rounded-md w-full shadow-md"
            />
            <AiOutlineSearch className="absolute top-3 right-3 text-gray-400" />
          </div>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {filteredProducts.map((product) => {
            // Conditional border color based on product status
            const borderColor = product.promotionApplied
              ? "border-green-500"
              : product.stock <= 0
              ? "border-red-500"
              : "border-[#E76F51]";

            return (
              <div
                key={product._id}
                className={`p-4 bg-white rounded-lg shadow-lg border-4 ${borderColor}`}
              >
                <div className="relative h-40 bg-gray-300 rounded-lg overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="h-full bg-gray-300 rounded-lg flex items-center justify-center text-gray-500">
                      No Images Available
                    </div>
                  )}
                </div>
                <h3 className="text-center mb-4 text-xl font-semibold">
                  {product.name}
                </h3>
                <div className="text-center mb-4">
                  <p className="text-lg font-medium text-gray-700">
                    Rs. {product.price.toFixed(2)}
                  </p>
                  <p
                    className={`text-sm ${
                      product.stock > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {product.promotionApplied ? (
                      <span>
                        Promotion: {getPromotionDetails(product.promotionId)}
                      </span>
                    ) : (
                      <span>No Promotion Applied</span>
                    )}
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  {product.promotionApplied ? (
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowPromotionModal(true);
                      }}
                      className="btn bg-red-500 text-white flex items-center space-x-2 px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition-colors"
                    >
                      <HiOutlineTag /> <span>Remove Promotion</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowPromotionModal(true);
                      }}
                      className="btn bg-green-500 text-white flex items-center space-x-2 px-4 py-2 rounded-md shadow-md hover:bg-green-600 transition-colors"
                    >
                      <HiOutlineTag /> <span>Apply Promotion</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowRestockModal(true);
                    }}
                    className="btn bg-[#E76F51] text-white flex items-center space-x-2 px-4 py-2 rounded-md shadow-md hover:bg-[#D64F3D] transition-colors"
                  >
                    <BiRefresh /> <span>Restock</span>
                  </button>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Restock Modal */}
      {showRestockModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box relative">
              <h2 className="font-russo text-2xl mb-4">Restock Product</h2>
              <p className="mb-2">
                Restock quantity for <strong>{selectedProduct?.name}</strong>
              </p>
              <input
                type="number"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(Number(e.target.value))}
                className="input input-bordered mb-4 w-full"
                placeholder="Enter quantity"
              />
              <div className="flex justify-end">
                <button
                  className="btn bg-red-500 text-white mr-2"
                  onClick={() => setShowRestockModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-green-500 text-white"
                  onClick={handleRestock}
                >
                  Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      {showPromotionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box relative">
              <h2 className="font-russo text-2xl mb-4">
                {selectedProduct.promotionApplied
                  ? "Remove Promotion"
                  : "Apply Promotion"}
              </h2>
              {selectedProduct.promotionApplied ? (
                <p>
                  Are you sure you want to remove the promotion from{" "}
                  <strong>{selectedProduct.name}</strong>?
                </p>
              ) : (
                <div>
                  <p>
                    Select a promotion to apply to{" "}
                    <strong>{selectedProduct.name}</strong>:
                  </p>
                  <select
                    value={selectedPromotion}
                    onChange={(e) => setSelectedPromotion(e.target.value)}
                    className="select select-bordered w-full mb-4"
                  >
                    <option value="">Select Promotion</option>
                    {promotions.map((promotion) => (
                      <option key={promotion._id} value={promotion._id}>
                        {promotion.name} - {promotion.discount}%
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  className="btn bg-red-500 text-white mr-2"
                  onClick={() => setShowPromotionModal(false)}
                >
                  Cancel
                </button>
                {selectedProduct.promotionApplied ? (
                  <button
                    className="btn bg-green-500 text-white"
                    onClick={handleRemovePromotion}
                  >
                    Remove Promotion
                  </button>
                ) : (
                  <button
                    className="btn bg-green-500 text-white"
                    onClick={handleApplyPromotion}
                    disabled={!selectedPromotion}
                  >
                    Apply Promotion
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
