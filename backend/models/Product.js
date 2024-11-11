const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const productSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number }, // Stores the original price before applying a promotion
  colors: [String],
  sizes: [String],
  description: { type: String, required: true },
  manufacturedDate: { type: Date, required: false },
  category: { type: String },
  images: [String],
  stock: { type: Number, default: 0 }, // Add stock attribute with default value 0
  promotionApplied: { type: Boolean, default: false }, // Indicates if a promotion is applied
  promotionId: { type: String, default: "" }, // Stores the ID of the applied promotion
  shopID: {
    type: String,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
