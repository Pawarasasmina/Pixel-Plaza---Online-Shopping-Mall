const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const wishlistSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  userID: { type: String,},
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // Referencing the product model
  addedDate: { type: Date, default: Date.now },
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
