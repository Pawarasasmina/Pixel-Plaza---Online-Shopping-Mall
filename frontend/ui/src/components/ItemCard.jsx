import React from "react";
import { Link } from "react-router-dom";
import "../styles/ItemCard.css";

const ItemCard = ({ item }) => {
  // Function to truncate the description
  const truncateDescription = (description, maxLength) => {
    if (description.length <= maxLength) return description;
    return description.slice(0, maxLength) + "..."; // Truncate and add "..."
  };

  return (
    <Link to={`/purchase/${item._id}`} className="item-card-link">
      {" "}
      {/* Pass the item ID */}
      <div className="item-card">
        <img
          src={
            item.images && item.images.length > 0
              ? item.images[0]
              : "/default-image.png"
          } // Display first image or a default image
          alt={item.name}
          className="item-image"
        />
        <div className="item-details">
          <h3 className="item-name">{item.name}</h3>
          {/* Truncated description */}
          <span className="discount">
            {truncateDescription(item.description, 100)} {/* Adjust max length */}
          </span>
          <br />
          <span className="category">{item.category}</span>

          <div className="item-price">
            <span className="current-price">Rs.{item.price}</span>
            <span className="original-price">{item.originalPrice}</span>
          </div>

          <div className="item-rating">
            <span className="rating-stars">★★★★☆</span>
            <span className="rating-count">(123 reviews)</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;
