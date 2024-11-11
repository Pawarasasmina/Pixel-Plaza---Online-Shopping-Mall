const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');

// Add item to wishlist
// In your wishlistRoutes.js
router.post('/', async (req, res) => {
  const { productId, userID } = req.body;

  if (!productId || !userID) {
    return res.status(400).json({ message: 'Product ID and User ID are required.' });
  }

  try {
    const newWishlistItem = new Wishlist({ productId, userID });
    await newWishlistItem.save();
    res.status(200).json(newWishlistItem);
  } catch (error) {
    console.error('Error saving wishlist item:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Get all wishlist items
router.get('/wishlist', async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find().populate('productId');
    res.status(200).json(wishlistItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist', error: err });
  }
});

router.get('/:userID', async (req, res) => {
  const { userID } = req.params; // Get userID from the URL parameter

  try {
    const wishlistItems = await Wishlist.find({ userID }).populate('productId'); // Populate product details
    res.status(200).json(wishlistItems);
  } catch (error) {
    console.error('Error retrieving wishlist items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Remove item from wishlist
// Remove item from wishlist
router.delete('/:id', async (req, res) => { // Change the route to match /:id
  const { id } = req.params; // This will now correspond to the _id of the wishlist item

  try {
    const deletedItem = await Wishlist.findByIdAndDelete(id); // Use findByIdAndDelete instead

    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    res.status(200).json({ message: 'Item removed from wishlist', deletedItem });
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
