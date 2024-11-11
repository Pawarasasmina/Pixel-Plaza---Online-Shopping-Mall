const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  floorID: {
    type: String,
    unique: true,
    required: true,
  },
  shopID: {
    type: String,
    unique: true,
  },
  shopKeeperPhoto: {
    type: String,
  },
  shopKeeperName: {
    type: String,
  },
  shopName: {
    type: String,
  },
  assignDate: {
    type: Date,
  },
  Value: {
    type: Number,
  },
  contactInfo: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
});

const Shops = mongoose.model("ShopCompartments", shopSchema);

module.exports = Shops;
