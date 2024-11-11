import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";
import CartItem from "../components/CartItem";
import CardPopup from "../components/CardPopup";
import jsPDF from "jspdf";
import "jspdf-autotable";
import CustomAlert from "../components/CustomAlert";
import ConfirmationModal from "../components/ConfirmationModal";

const CartPage = () => {
  const [items, setItems] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertOpen(true);
  };
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [checkoutConfirmed, setCheckoutConfirmed] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Retrieve the userId from localStorage

    axios
      .get(`http://localhost:3000/api/cartProduct/user/${userId}`) // Append userId to the URL
      .then((res) => {
        setItems(res.data); // Set the cart items for the specific user
      })
      .catch(() => {
        console.log("Error while getting data");
      });
  }, []);

  const handleCheckout = () => {
    const itemsToCheckout = items.filter((item) =>
      selectedItems.includes(item._id)
    );

    if (itemsToCheckout.length === 0) {
      showAlert("No items selected for checkout.");
      return;
    }

    if (selectedPaymentMethod === "") {
      showAlert("Please select a payment method.");
      return;
    }

    if (deliveryOption === "") {
      showAlert("Please select a delivery or pickup option.");
      return;
    }

    const confirmCheckout = window.confirm(
      "Are you sure you want to proceed with checkout?"
    );

    if (confirmCheckout) {
      const userId = localStorage.getItem("userId"); // Retrieve userId from localStorage
      const requestData = {
        userId, // Include the userId in the request
        items: itemsToCheckout.map((item) => ({
          name: item.name,
          price: item.price,
          count: item.count,
          color: item.color,
          sizes: item.sizes,
          description: item.description,
          images: item.images,
          shopID: item.shopID, // Include shopID in the request
        })),
      };

      // Move selected items to Previous Orders
      axios
        .post("http://localhost:3000/api/previousOrders", requestData) // Pass userId along with items and their shopID
        .then(() => {
          // Delete selected items from Cart
          return axios.delete("http://localhost:3000/api/cartProduct", {
            data: { ids: selectedItems },
          });
        })
        .then(() => {
          // Update the cart to only show remaining items (non-selected)
          setItems(items.filter((item) => !selectedItems.includes(item._id)));
          setSelectedItems([]); // Clear selected items list
          alert(
            "Checkout successful! Your selected items are now saved under Previous Orders."
          );
          navigate("/profile", { state: { activeCategory: "previousOrders" } });
        })
        .catch((error) => {
          console.error("Error during checkout process:", error);
          alert(
            `Error during checkout: ${
              error.response?.data?.message || error.message
            }`
          );
        });
    } else {
      console.log("Checkout cancelled");
    }
  };

  // Add this function to handle the clear all functionality
 // Add this function to handle the clear all functionality
const handleClearAll = () => {
  const confirmClearAll = window.confirm(
    "Are you sure you want to clear all items from the cart? This action will remove all items, regardless of selection."
  );

  if (confirmClearAll) {
    const userId = localStorage.getItem("userId");
    console.log("UserID being sent:", userId);  // Log userId for debugging

    axios
      .delete("http://localhost:3000/api/cartProduct/clearAll", {
        data: { userId },  // Ensure data is sent correctly
      })
      .then(() => {
        setItems([]); // Clear all items from the state
        setSelectedItems([]); // Clear any selected items
        alert("All items have been cleared from the cart.");
      })
      .catch((err) => {
        console.error("Clear all error", err);
      });
  }
};

  
  

  // Add this button next to your "Clear Selected" button in the return JSX
  <button
    name="clear-all-button"
    onClick={handleClearAll}
    style={{
      marginTop: "15px",
      padding: "10px 20px",
      backgroundColor: "#ff6347", // Different color to distinguish
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginLeft: "10px", // Space between the two buttons
    }}
  >
    Clear All
  </button>;

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:3000/api/cartProduct/${id}`)
        .then(() => {
          setItems(items.filter((item) => item._id !== id));
          setSelectedItems(selectedItems.filter((itemId) => itemId !== id)); // Remove from selectedItems if deleted
        })
        .catch((err) => {
          console.log("Delete error", err);
        });
    } else {
      console.log("Delete action cancelled");
    }
  };

  const handleDeleteAll = () => {
    if (selectedItems.length === 0) {
      alert("No items selected for deletion.");
      return;
    }

    const confirmDeleteAll = window.confirm(
      "Are you sure you want to delete the selected items from the cart?"
    );

    if (confirmDeleteAll) {
      axios
        .delete("http://localhost:3000/api/cartProduct", {
          data: { ids: selectedItems },
        })
        .then(() => {
          setItems(items.filter((item) => !selectedItems.includes(item._id)));
          setSelectedItems([]);
        })
        .catch((err) => {
          console.log("Delete all error", err);
        });
    } else {
      console.log("Delete all action cancelled");
    }
  };

  const filteredItems = items.filter((item) => {
    const itemPrice = item.price * item.count;
    const itemQuantity = item.count;
    const isPriceInRange =
      (minPrice === "" || itemPrice >= minPrice) &&
      (maxPrice === "" || itemPrice <= maxPrice);
    const isQuantityInRange = minQuantity === "" || itemQuantity >= minQuantity;

    return isPriceInRange && isQuantityInRange;
  });

  const handlePopupOpen = () => setIsPopupOpen(true);
  const handlePopupClose = () => setIsPopupOpen(false);

  const handleCardSelection = (card) => {
    setSelectedCard(card);
    handlePopupClose();
  };

  const totalAmount = items
    .filter((item) => selectedItems.includes(item._id))
    .reduce((total, item) => total + item.price * item.count, 0);

  const toggleItemSelection = (id, isSelected) => {
    setSelectedItems((prevSelectedItems) =>
      isSelected
        ? [...prevSelectedItems, id]
        : prevSelectedItems.filter((itemId) => itemId !== id)
    );
  };

  return (
    <div className="w-[100vw] bg-dark">
      <div className="cart-page">
        <br />
        <div className="cart-container">
          <div className="cart-header">
            <h1>Your Cart</h1>
          </div>

          <button
            name="delete-all-button"
            onClick={handleDeleteAll}
            style={{
              margin: "15px",
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Clear Selected
          </button>
         
          <div className="cart-item-list">
            {filteredItems.length === 0
              ? "No Cart Items"
              : filteredItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onDelete={handleDelete}
                    onSelect={toggleItemSelection} // New prop for selection
                    isSelected={selectedItems.includes(item._id)} // Pass selected state
                  />
                ))}
          </div>

          <div className="cart-summary">
            <h2>Total: Rs.{totalAmount.toFixed(2)}</h2>
            <div className="options-container">
              <div className="payment-options">
                <label>Select Payment Method:</label>
                <div>
                  <input
                    type="radio"
                    id="credit-card"
                    name="payment"
                    value="credit-card"
                    onChange={() => setSelectedPaymentMethod("credit-card")}
                  />
                  <label htmlFor="credit-card">Credit Card</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="paypal"
                    name="payment"
                    value="paypal"
                    onChange={() => setSelectedPaymentMethod("paypal")}
                  />
                  <label htmlFor="paypal">PayPal</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="koko"
                    name="payment"
                    value="koko"
                    onChange={() => setSelectedPaymentMethod("koko")}
                  />
                  <label htmlFor="koko">Koko</label>
                </div>
                {selectedCard && (
                  <div className="selected-card-details">
                    <p>
                      <strong>Card Number:</strong> {selectedCard.number}
                    </p>
                    <p>
                      <strong>Card Holder:</strong> {selectedCard.holder}
                    </p>
                    <p>
                      <strong>Expiry Date:</strong> {selectedCard.expiry}
                    </p>
                    <p>
                      <strong>CVV:</strong> {selectedCard.cvv}
                    </p>
                  </div>
                )}
              </div>
              <div className="delivery-options">
                <label>Select Delivery or Pickup:</label>
                <div>
                  <input
                    type="radio"
                    id="delivery"
                    name="delivery"
                    value="delivery"
                    onChange={() => setDeliveryOption("delivery")}
                  />
                  <label htmlFor="delivery">Delivery</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="pickup"
                    name="delivery"
                    value="pickup"
                    onChange={() => setDeliveryOption("pickup")}
                  />
                  <label htmlFor="pickup">Pickup</label>
                </div>
              </div>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>

        <CardPopup
          isOpen={isPopupOpen}
          onClose={handlePopupClose}
          onCardSelect={handleCardSelection}
        />
        <CustomAlert
          isOpen={isAlertOpen}
          message={alertMessage}
          onClose={() => setIsAlertOpen(false)}
        />
        <br />
        <br />
      </div>
    </div>
  );
};

export default CartPage;
