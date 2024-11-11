const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Promotion = require("../models/Promotion");

// Create a new product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Failed to create product:", error.message);
    res
      .status(400)
      .json({ message: "Failed to create product", error: error.message });
  }
});

// Create multiple products (bulk insert)
router.post("/bulk", async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ message: "Request body must be an array of products" });
    }

    // Validate each product object if necessary
    for (const product of products) {
      if (
        !product.name ||
        !product.price ||
        !product.description ||
        !product.stock
      ) {
        return res.status(400).json({
          message: "Each product must have name, price, description, and stock",
        });
      }
    }

    // Insert products into the database
    const result = await Product.insertMany(products);
    res
      .status(201)
      .json({ message: "Products created successfully", products: result });
  } catch (error) {
    console.error("Failed to create products:", error.message);
    res
      .status(400)
      .json({ message: "Failed to create products", error: error.message });
  }
});

// Update a product by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { id: req.params.id }, // Find by UUID
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Failed to update product:", error.message);
    res
      .status(400)
      .json({ message: "Failed to update product", error: error.message });
  }
});

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
});

// Get a product by ID

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
});
// Get products by shopID
router.get("/shop/:shopID", async (req, res) => {
  try {
    const { shopID } = req.params;

    // Find products with the specified shopID
    const products = await Product.find({ shopID: shopID });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this shopID" });
    }
    res.status(200).json(products);
  } catch (error) {
    console.error("Failed to fetch products by shopID:", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
});

// Apply a promotion to a product
router.put("/applyPromotion/:id", async (req, res) => {
  const { promotionId } = req.body;

  try {
    const promotion = await Promotion.findById(promotionId);
    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    const product = await Product.findOne({ id: req.params.id }); // Find by UUID
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Save original price if not already saved
    if (product.originalPrice === undefined) {
      product.originalPrice = product.price;
    }

    // Calculate discounted price
    const discountedPrice =
      product.originalPrice * (1 - promotion.discount / 100);
    product.price = discountedPrice;
    product.promotionApplied = true;
    product.promotionId = promotionId;
    product.promotionEndDate = promotion.endDate;

    await product.save();

    res.status(200).json({
      message: "Promotion applied successfully",
      product,
    });
  } catch (error) {
    console.error("Failed to apply promotion:", error.message);
    res
      .status(500)
      .json({ message: "Failed to apply promotion", error: error.message });
  }
});

// Remove a promotion from a product
router.put("/removePromotion/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id }); // Find by UUID
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Revert to original price if promotion is removed
    if (product.originalPrice !== undefined) {
      product.price = product.originalPrice;
      product.originalPrice = undefined; // Remove the field
    } else {
      return res.status(400).json({ message: "No promotion was applied" });
    }

    product.promotionApplied = false;
    product.promotionId = "";
    product.promotionEndDate = undefined;

    await product.save();

    res.status(200).json({
      message: "Promotion removed successfully",
      product,
    });
  } catch (error) {
    console.error("Failed to remove promotion:", error.message);
    res
      .status(500)
      .json({ message: "Failed to remove promotion", error: error.message });
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  try {
    // Use the MongoDB `_id` field to find and delete the product
    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id, // Use `_id` instead of `id`
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Failed to delete product:", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete product", error: error.message });
  }
});

// Revert product price if promotion expired
const checkPromotionExpiryAndRevert = async () => {
  try {
    const products = await Product.find({
      promotionEndDate: { $lte: new Date() },
      promotionApplied: true,
      originalPrice: { $exists: true },
    });

    products.forEach(async (product) => {
      product.price = product.originalPrice;
      product.originalPrice = undefined; // Remove the field
      product.promotionApplied = false;
      product.promotionId = "";
      product.promotionEndDate = undefined;
      await product.save();
    });
  } catch (error) {
    console.error("Failed to revert product prices:", error.message);
  }
};

// Schedule the check for promotion expiry (e.g., every day)
setInterval(checkPromotionExpiryAndRevert, 24 * 60 * 60 * 1000); // Check daily

module.exports = router;
