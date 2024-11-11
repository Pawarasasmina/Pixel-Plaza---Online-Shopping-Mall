import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditCartItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cartItem, setCartItem] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Fetch Cart Item and Product Details
  useEffect(() => {
    const fetchCartItemAndProduct = async () => {
      try {
        // Fetch the cart item details
        const cartRes = await axios.get(`http://localhost:3000/api/cartProduct/${id}`);
        setCartItem(cartRes.data);

        // Fetch the associated product details using the productId from the cart item
        const productRes = await axios.get(`http://localhost:3000/api/products/${cartRes.data.productId}`);
        setProduct(productRes.data);

        // Set initial values
        setMainImage(cartRes.data.images?.length > 0 ? cartRes.data.images[0] : "/default-image.png");
        setQuantity(cartRes.data.count || 1);
        setSelectedColor(cartRes.data.color);
        setSelectedSize(cartRes.data.sizes);
      } catch (err) {
        console.log("Error fetching cart item or product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItemAndProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!cartItem || !product) return <div className="error">No cart item found.</div>;

  const handleThumbnailClick = (src) => setMainImage(src);
  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const handleUpdateCartItem = async () => {
    try {
      await axios.put(`http://localhost:3000/api/cartProduct/${id}`, {
        count: quantity,
        color: selectedColor,
        sizes: selectedSize,
      });
      alert("Cart item updated successfully!");
      navigate("/cart");
    } catch (err) {
      console.log("Error updating cart item:", err);
      alert("Failed to update cart item.");
    }
  };

  const totalPrice = (cartItem.price * quantity).toFixed(2);

  return (
    <div className="bg-dark min-h-screen py-8 w-[99vw]">
      <div className="flex flex-col lg:flex-row items-start gap-8 bg-white p-6 shadow-lg rounded-lg">
        <div className="w-full lg:w-1/2">
          <img src={mainImage} alt="Product" className="w-full h-auto rounded-lg shadow-md mb-4" />
          <div className="flex gap-2">
            {cartItem.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-[#ff5733]"
                onClick={() => handleThumbnailClick(image)}
              />
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="text-5xl font-bold text-[#555353] mb-4">{cartItem.name}</h2>
          <p className="text-2xl font-semibold text-[#ff5733] mb-2">Rs. {cartItem.price}</p>
          {cartItem.originalPrice && (
            <p className="text-sm text-gray-500 line-through mb-4">Rs. {cartItem.originalPrice}</p>
          )}
          <p className="text-m text-gray-700 mb-4">{cartItem.description}</p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600 mb-2">Select Color:</label>
              <div className="flex gap-2">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`w-8 h-8 rounded-full cursor-pointer ${selectedColor === color ? "ring-4 ring-gray-900" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-600 mb-2">Select Size:</label>
              <div className="flex gap-2">
                {product.sizes.map((size, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded cursor-pointer ${selectedSize === size ? "border-gray-900 text-dark" : "border-gray-400"}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="flex items-center mb-6">
            <button className="px-4 py-2 bg-[#ff5733] text-white font-bold rounded-lg" onClick={handleDecrement}>
              -
            </button>
            <input
              type="number"
              value={quantity}
              readOnly
              className="mx-4 w-16 text-center border rounded-lg p-2"
            />
            <button className="px-4 py-2 bg-[#ff5733] text-white font-bold rounded-lg" onClick={handleIncrement}>
              +
            </button>
          </div>

          {/* Total Price */}
          <div className="mb-4">
            <p className="text-lg font-bold text-gray-700">
              Total Price: <span className="text-[#ff5733]">Rs. {totalPrice}</span>
            </p>
          </div>

          {/* Update Button */}
          <button
            className="w-full bg-[#ff5733] text-white font-bold py-2 rounded-lg shadow-lg hover:bg-[#e14e2b] transition duration-300"
            onClick={handleUpdateCartItem}
          >
            Update Item
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCartItem;
