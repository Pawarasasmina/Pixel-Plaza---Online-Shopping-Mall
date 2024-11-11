const mongoose = require("mongoose");

const previousOrderSchema = new mongoose.Schema({
  userId: { type: String },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      count: { type: Number, required: true },
      color: { type: String, default: "" },
      sizes: { type: String, default: "" },
      description: { type: String, default: "" },
      images: { type: [String], default: [] },
      shopID: {
        type: String,
      },
    },
  ],
  date: { type: Date, default: Date.now },
});

const PreviousOrder = mongoose.model("PreviousOrder", previousOrderSchema);

module.exports = PreviousOrder;
