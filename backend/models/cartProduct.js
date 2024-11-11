const mongoose = require("mongoose");

const cartproductSchema = new mongoose.Schema({
  userId: { type: String },
  productId: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  count: { type: Number, required: true },
  color: { type: String },
  sizes: { type: String },
  description: { type: String, required: true },
  images: [String],
  shopID: {
    type: String,
  },
});

const cartProduct = mongoose.model("cartProduct", cartproductSchema);

module.exports = cartProduct;
