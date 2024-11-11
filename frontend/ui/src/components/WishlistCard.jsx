import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/WishlistCard.css";

const WishlistCard = ({ productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log("Error fetching product details:", err);
      });
  }, [productId]);

  const handleRemoveFromWishlist = () => {
    axios
      .delete(`http://localhost:3000/api/wishlist/${productId}`)
      .then(() => {
        alert("Item removed from wishlist.");
        window.location.reload(); // Reload the page to reflect the removal
      })
      .catch((err) => {
        console.log("Error removing item from wishlist:", err);
      });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wishlist-card">
      <img src={product.images[0]} alt={product.name} />
      <div className="wishlist-details">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Price: Rs. {product.price}</p>
        <button className="remove-btn" onClick={handleRemoveFromWishlist}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
