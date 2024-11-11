const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Promotion = require("../models/Promotion");

// Create a new promotion
router.post("/", async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res
      .status(201)
      .json({ message: "Promotion created successfully", promotion });
  } catch (error) {
    console.error("Failed to create promotion:", error.message);
    res
      .status(400)
      .json({ message: "Failed to create promotion", error: error.message });
  }
});

// Get all promotions
router.get("/", async (req, res) => {
  try {
    const promotions = await Promotion.find();
    res.status(200).json(promotions);
  } catch (error) {
    console.error("Failed to fetch promotions:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch promotions", error: error.message });
  }
});

// Get promotions by shopID
router.get("/shop/:shopID", async (req, res) => {
  try {
    const { shopID } = req.params;

    // Find promotions with the specified shopID
    const promotions = await Promotion.find({ shopID: shopID });

    if (promotions.length === 0) {
      return res
        .status(404)
        .json({ message: "No promotions found for this shopID" });
    }

    res.status(200).json(promotions);
  } catch (error) {
    console.error("Failed to fetch promotions by shopID:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch promotions", error: error.message });
  }
});

// Delete a promotion by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findByIdAndDelete(id);

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (error) {
    console.error("Failed to delete promotion:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete promotion", error: error.message });
  }
});

// Automatically delete promotions by endDate
const deleteExpiredPromotions = async () => {
  try {
    const now = new Date();
    const result = await Promotion.deleteMany({ endDate: { $lt: now } });
    console.log(`Deleted ${result.deletedCount} expired promotions`);
  } catch (error) {
    console.error("Failed to delete expired promotions:", error.message);
  }
};

// Schedule the automatic deletion to run at midnight every day
const schedule = require("node-schedule");
schedule.scheduleJob("0 0 * * *", deleteExpiredPromotions);

module.exports = router;
