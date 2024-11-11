import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import CheckoutPopup from "../components/CheckoutPopup"; // Import the CheckoutPopup component

const PurchasingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deliveryDates, setDeliveryDates] = useState({ start: "", end: "" });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [shopDetails, setShopDetails] = useState(null); // State for shop details

  useEffect(() => {
    // Fetch product details
    axios
      .get(`http://localhost:3000/api/products/${id}`)
      .then((res) => {
        const productData = res.data;
        setProduct(productData);
        setMainImage(
          productData.images && productData.images.length > 0
            ? productData.images[0]
            : "/default-image.png"
        );

        // Fetch the shop details using the shopID from the product
        if (productData.shopID) {
          axios
            .get(
              `http://localhost:3000/api/shops/getByShopID/${productData.shopID}`
            )
            .then((shopRes) => {
              setShopDetails(shopRes.data);
            })
            .catch((err) => {
              console.log("Error fetching shop details:", err);
            });
        }
      })
      .catch((err) => {
        console.log("Error fetching product:", err);
      });
  }, [id]);

  const handleThumbnailClick = (src) => {
    setMainImage(src);
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    const calculateDeliveryDates = () => {
      const today = new Date();
      const start = new Date();
      const end = new Date();

      start.setDate(today.getDate() + 5);
      end.setDate(today.getDate() + 7);

      const options = { day: "numeric", month: "short" };
      setDeliveryDates({
        start: start.toLocaleDateString("en-GB", options),
        end: end.toLocaleDateString("en-GB", options),
      });
    };

    calculateDeliveryDates();
  }, []);

  const handleAddToCart = () => {
    const userID = localStorage.getItem("userId"); // Get the userID from localStorage

    // Check if color and size are required
    const isColorRequired = product.colors && product.colors.length > 0;
    const isSizeRequired = product.sizes && product.sizes.length > 0;

    // Validate color and size selection
    if (isColorRequired && !selectedColor) {
      alert("Please select a color.");
      return;
    }

    if (isSizeRequired && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    // Send data to the backend using axios
    axios
      .post("http://localhost:3000/api/cartProduct", {
        userId: userID, // Include the userId from localStorage
        productId: product._id, // Product ID
        name: product.name, // Product name
        price: product.price, // Product price
        count: quantity, // Selected quantity
        color: selectedColor, // Selected color
        sizes: selectedSize, // Selected size
        description: product.description, // Product description
        images: product.images, // Product images
        shopID: product.shopID, // Include shopID for the product
      })
      .then(() => {
        alert("Item added to cart successfully!");
        navigate("/cart"); // Navigate to the cart page upon success
      })
      .catch((err) => {
        console.log("Error adding item to cart:", err); // Log any errors
        alert("Failed to add item to cart."); // Notify user of failure
      });
  };

  const handleBuyNow = () => {
    const isColorRequired = product.colors && product.colors.length > 0;
    const isSizeRequired = product.sizes && product.sizes.length > 0;

    if (isColorRequired && !selectedColor) {
      alert("Please select a color.");
      return;
    }

    if (isSizeRequired && !selectedSize) {
      alert("Please select a size.");
      return;
    }

    // Setting the state to open the checkout popup
    setIsCheckoutOpen(true);
  };

  const handleAddToWishlist = async () => {
    const userID = localStorage.getItem("userId");

    try {
      const response = await axios.post("http://localhost:3000/api/wishlist", {
        productId: product._id, // Use the appropriate product ID
        userID: userID,
      });

      if (response.status === 200) {
        alert("Item added to wishlist!");
      }
    } catch (error) {
      console.error("Error adding item to wishlist:", error);
      alert("Failed to add item to wishlist.");
    }
  };

  const handleCheckoutConfirm = ({ selectedPaymentMethod, deliveryOption }) => {
    // Retrieve the userId from localStorage or any authentication state
    const userId = localStorage.getItem("userId");

    const orderData = {
      userId: userId || "exampleUserId", // Use the dynamically retrieved userId
      items: [
        {
          name: product.name,
          price: product.price,
          count: quantity,
          color: selectedColor,
          sizes: selectedSize,
          description: product.description,
          images: product.images,
          shopID: product.shopID, // Include the shopID here
        },
      ],
      paymentMethod: selectedPaymentMethod, // Add the selected payment method
      deliveryOption: deliveryOption, // Add the selected delivery option
    };

    axios
      .post("http://localhost:3000/api/previousOrders", orderData)
      .then(() => {
        alert(
          "Purchase successful! Your order is now saved under Previous Orders."
        );
        navigate("/profile", { state: { activeCategory: "previousOrders" } });
      })
      .catch((error) => {
        console.error("Error during purchase process:", error);
        alert(
          `Error during purchase: ${
            error.response?.data?.message || error.message
          }`
        );
      })
      .finally(() => {
        setIsCheckoutOpen(false);
      });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <div className="bg-dark min-h-screen py-8 w-[100vw]">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <img
                src={mainImage}
                alt="Product"
                className="w-full h-auto object-cover rounded-md shadow-md"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md cursor-pointer hover:ring-2 hover:ring-gray-400"
                  onClick={() => handleThumbnailClick(image)}
                />
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Seller Details</h3>
              <p>
                <strong>Seller Name:</strong> {shopDetails?.shopName || "N/A"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {shopDetails?.description || "N/A"}
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-6xl text-gray-700 font-bold mb-7">
              {product.name}
            </h2>
            <p className="text-4xl text-gray-600 mb-6">
              Rs. {product.price}
              {product.originalPrice && (
                <span className="line-through text-2xl text-red-500 ml-2">
                  Rs. {product.originalPrice}
                </span>
              )}
            </p>
            <p className="text-gray-600 mt-2">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="mt-4">
                <label className="block mb-2 text-dark font-semibold">
                  Select Color:
                </label>
                <div className="flex gap-2">
                  {product.colors.map((color, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full cursor-pointer ${
                        selectedColor === color ? "ring-4 ring-gray-700" : ""
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    ></div>
                  ))}
                </div>
              </div>
            )}

{product.sizes && product.sizes.length > 0 && (
  <div className="mt-4">
    <label className="block mb-2 text-dark font-semibold">
      Select Size:
    </label>
    <div className="flex gap-2 text-gray-600">
      {product.sizes.map((size, index) => (
        <div
          key={index}
          className={`p-4 border rounded cursor-pointer transition-all duration-300 
            ${selectedSize === size ? "bg-orange-500 text-white border-orange-600 scale-105" : "border-gray-300 bg-white hover:bg-gray-100"}
          `}
          onClick={() => setSelectedSize(size)}
        >
          {size}
        </div>
      ))}
    </div>
  </div>
)}


            <div className="mt-4">
              <label className="block mb-2  text-dark font-semibold">
                Quantity:
              </label>
              <div className="flex items-center">
                <button
                  onClick={handleDecrement}
                  className="px-3 py-1 border rounded-l bg-gray-800 hover:bg-gray-600"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  readOnly
                  className="w-12 h-9 text-center bg-white text-dark border-t border-b"
                />
                <button
                  onClick={handleIncrement}
                  className="px-3 py-1 border rounded-r bg-gray-800 hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            <p className="mt-4 text-3xl text-gray-500 font-semibold">
              Total Price: Rs. {totalPrice}
            </p>
            <p className="mt-1 text-sm text-gray-500 font-semibold">
              Delivery between {deliveryDates.start} and {deliveryDates.end}
            </p>

            <div className="flex items-center mt-10 space-x-2">
              <button
                onClick={handleAddToCart}
                className="px-6 py-4 bg-orange-600 text-white rounded-md hover:bg-orange-700"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="px-6 py-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToWishlist}
                className="px-6 py-4 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                <FaHeart className="mr-2" />
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>
      {isCheckoutOpen && (
        <CheckoutPopup
          product={product}
          onClose={() => setIsCheckoutOpen(false)}
          onConfirm={handleCheckoutConfirm}
        />
      )}
    </div>
  );
};

export default PurchasingPage;
