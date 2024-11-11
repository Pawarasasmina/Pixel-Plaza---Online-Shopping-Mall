import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const userId = localStorage.getItem("userId"); // Retrieve user ID from local storage

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/wishlist/${userId}`);
        
        // Filter out duplicate products based on productId
        const uniqueItems = [];
        const productIds = new Set();

        response.data.forEach(item => {
          if (!productIds.has(item.productId._id)) {
            uniqueItems.push(item);
            productIds.add(item.productId._id);
          }
        });

        setWishlistItems(uniqueItems);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      }
    };

    fetchWishlistItems();
  }, [userId]);

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/wishlist/${itemId}`);
      if (response.status === 200) {
        alert('Item removed from wishlist!');
        // Optionally, re-fetch wishlist items or remove the item locally from state
        setWishlistItems(prevItems => prevItems.filter(item => item._id !== itemId)); // Use _id for comparison
      }
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
      alert('Failed to remove item from wishlist.');
    }
  };
  

  return (
    <div className="bg-dark min-h-screen py-8 w-[100vw]">
      <div className="container mx-auto p-4">
        <h2 className="text-4xl text-white font-bold mb-4">My Wishlist</h2>
        {wishlistItems.length === 0 ? (
          <p className="text-white">Your wishlist is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg p-4">
                <img
                  src={item.productId.images[0]} // Assuming productId has an images array
                  alt={item.productId.name}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-xl font-semibold">{item.productId.name}</h3>
                <p className="text-gray-600">Rs. {item.productId.price}</p>
                <p className="text-gray-500 mt-2">{item.productId.description}</p>
                <div className="mt-4 flex justify-between">
                <Link to={`/purchase/${item.productId._id}`}>
                  <button  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  
                    View Product
                    
                  </button>
                  </Link>
                  <button 
                    onClick={() => handleRemoveFromWishlist(item._id)} 
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
