const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const promotionSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true }, // Custom ID field
  description: { type: String, required: true },
  discount: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  poster: { type: String, required: true }, // Optional field for promotion poster image
  shopID: {
    type: String,
  },
});

const Promotion = mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
