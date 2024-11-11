const express = require("express");
const router = express.Router();
const Shops = require("../models/Shops");

// Route to add only the floorID
router.post("/addFloorID", async (req, res) => {
  try {
    const newFloorID = req.body.floorID; // Get floorID from the request body

    // Check if a shop with this floorID already exists
    const existingShop = await Shops.findOne({ floorID: newFloorID });
    if (existingShop) {
      return res
        .status(400)
        .json({ message: "Shop with this floorID already exists" });
    }

    const newShop = new Shops({
      floorID: newFloorID, // Set floorID from request
    });

    await newShop.save();
    res.status(201).json({ message: "Floor ID added successfully", newShop });
  } catch (error) {
    console.error("Error adding floor ID:", error);
    res.status(500).json({ message: "Failed to add floor ID", error });
  }
});

// Route to update other shop details after the floorID has been set
router.put("/updateDetails/:floorID", async (req, res) => {
  try {
    const { floorID } = req.params; // Get the floorID from the request params

    // Check if the shop with this floorID exists
    const shop = await Shops.findOne({ floorID: floorID });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Update other details
    shop.shopKeeperName = req.body.shopKeeperName;
    shop.shopID = req.body.shopID;
    shop.shopName = req.body.shopName;
    shop.assignDate = req.body.assignDate;
    shop.Value = req.body.Value;
    shop.description = req.body.description; // Optional, as it's also updated in the next route

    await shop.save();

    res
      .status(200)
      .json({ message: "Shop details updated successfully", shop });
  } catch (error) {
    console.error("Error updating shop details:", error);
    res.status(500).json({ message: "Failed to update shop details", error });
  }
});

// Route to add or update shopkeeper image and description
router.put("/updateShopkeeper/:floorID", async (req, res) => {
  try {
    const { floorID } = req.params; // Get the floorID from the request params

    // Find the shop with this floorID
    const shop = await Shops.findOne({ floorID: floorID });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Update shopkeeper details
    shop.shopKeeperPhoto = req.body.shopKeeperPhoto || shop.shopKeeperPhoto; // Update only if new value is provided
    shop.description = req.body.description || shop.description; // Update only if new value is provided

    await shop.save();

    res
      .status(200)
      .json({ message: "Shopkeeper details updated successfully", shop });
  } catch (error) {
    console.error("Error updating shopkeeper details:", error);
    res
      .status(500)
      .json({ message: "Failed to update shopkeeper details", error });
  }
});

// Route to add a new shop
router.post("/add", async (req, res) => {
  try {
    const newFloorID = req.body.floorID; // Get floorID from the request body

    const newShop = new Shops({
      floorID: newFloorID, // Use provided floor ID
      shopID: req.body.shopID,
      shopKeeperPhoto: req.body.shopKeeperPhoto,
      shopKeeperName: req.body.shopKeeperName,
      shopName: req.body.shopName,
      assignDate: req.body.assignDate,
      Value: req.body.Value,
      description: req.body.description,
    });

    await newShop.save();
    res.status(201).json({ message: "Shop added successfully", newShop });
  } catch (error) {
    console.error("Error adding shop:", error);
    res.status(500).json({ message: "Failed to add shop", error });
  }
});

// Route to bulk insert shops
router.post("/bulkAdd", async (req, res) => {
  try {
    const shopsData = req.body; // Get the array of shop data from the request body

    // Validate that the request body is an array
    if (!Array.isArray(shopsData)) {
      return res.status(400).json({ message: "Request body must be an array" });
    }

    // Create an array of shop documents to be inserted
    const newShops = shopsData.map((shop) => ({
      floorID: shop.floorID,
      shopID: shop.shopID,
      shopKeeperPhoto: shop.shopKeeperPhoto,
      shopKeeperName: shop.shopKeeperName,
      shopName: shop.shopName,
      assignDate: shop.assignDate,
      Value: shop.Value,
      description: shop.description,
    }));

    // Insert the array of shops into the database
    const result = await Shops.insertMany(newShops);

    res.status(201).json({ message: "Shops added successfully", result });
  } catch (error) {
    console.error("Error bulk inserting shops:", error);
    res.status(500).json({ message: "Failed to bulk insert shops", error });
  }
});

// Route to get all shops
router.get("/get", async (req, res) => {
  try {
    const shops = await Shops.find();
    res.status(200).json(shops);
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ message: "Failed to fetch shops", error });
  }
});

// Route to get all shops that have a shop name
router.get("/getShopsWithName", async (req, res) => {
  try {
    const shops = await Shops.find({ shopName: { $exists: true, $ne: "" } }); // Only return shops with shopName
    res.status(200).json(shops);
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ message: "Failed to fetch shops", error });
  }
});

// Route to get a single shop by shopID
router.get("/getByShopID/:shopID", async (req, res) => {
  try {
    const { shopID } = req.params; // Extract shopID from the request params
    const shop = await Shops.findOne({ shopID: shopID }); // Find the shop by shopID
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" }); // If no shop is found, return 404
    }
    res.status(200).json(shop); // Return the found shop
  } catch (error) {
    console.error("Error fetching shop by shopID:", error);
    res.status(500).json({ message: "Failed to fetch shop", error }); // Handle errors
  }
});

// Route to get shops by category
router.get("/getByCategory/:category", async (req, res) => {
  try {
    const { category } = req.params; // Extract the category from request params

    // Find all shops with the given category
    const shops = await Shops.find({ category: category });

    // Check if any shops are found
    if (shops.length === 0) {
      return res
        .status(404)
        .json({ message: "No shops found for this category" });
    }

    res.status(200).json(shops); // Return the list of shops for the category
  } catch (error) {
    console.error("Error fetching shops by category:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch shops by category", error });
  }
});

// Route to get a single shop by floorID
router.get("/get/:floorID", async (req, res) => {
  try {
    const { floorID } = req.params;
    const shop = await Shops.findOne({ floorID: floorID });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json(shop);
  } catch (error) {
    console.error("Error fetching shop:", error);
    res.status(500).json({ message: "Failed to fetch shop", error });
  }
});

// Route to update a shop by floorID
router.put("/update/:floorID", async (req, res) => {
  try {
    const { floorID } = req.params;
    const updatedShop = await Shops.findOneAndUpdate(
      { floorID: floorID },
      req.body,
      { new: true }
    );
    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json({ message: "Shop updated successfully", updatedShop });
  } catch (error) {
    console.error("Error updating shop:", error);
    res.status(500).json({ message: "Failed to update shop", error });
  }
});

// Route to update shop details by shopID
router.put("/updateByShopID/:shopID", async (req, res) => {
  try {
    const { shopID } = req.params; // Get the shopID from the request params

    // Check if the shop with this shopID exists
    const shop = await Shops.findOne({ shopID: shopID });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Update shop details with new state fields
    shop.shopKeeperPhoto = req.body.shopKeeperPhoto || shop.shopKeeperPhoto; // Update if new value is provided
    shop.description = req.body.description || shop.description;
    shop.contactInfo = req.body.contactInfo || shop.contactInfo; // Update contactInfo
    shop.category = req.body.category || shop.category; // Update category
    shop.floorID = req.body.floorID || shop.floorID; // Update floorID if new value is provided
    shop.shopKeeperName = req.body.shopKeeperName || shop.shopKeeperName;
    shop.shopName = req.body.shopName || shop.shopName;
    shop.assignDate = req.body.assignDate || shop.assignDate;
    shop.Value = req.body.Value || shop.Value;

    await shop.save();

    // Send response back to the client
    res.status(200).json({
      message: "Shop details updated successfully",
      updatedShop: {
        shopKeeperPhoto: shop.shopKeeperPhoto,
        description: shop.description,
        contactInfo: shop.contactInfo,
        category: shop.category,
      },
    });
  } catch (error) {
    console.error("Error updating shop details by shopID:", error);
    res.status(500).json({ message: "Failed to update shop details", error });
  }
});

// Route to delete a shop by floorID
router.delete("/delete/:floorID", async (req, res) => {
  try {
    const { floorID } = req.params;
    const deletedShop = await Shops.findOneAndDelete({ floorID: floorID });
    if (!deletedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }
    res.status(200).json({ message: "Shop deleted successfully" });
  } catch (error) {
    console.error("Error deleting shop:", error);
    res.status(500).json({ message: "Failed to delete shop", error });
  }
});

// Route to delete multiple shops by floorIDs
router.delete("/deleteMultiple", async (req, res) => {
  try {
    const floorIDs = req.body.floorIDs; // Get the array of floor IDs from the request body

    // Validate that the request body is an array
    if (!Array.isArray(floorIDs) || floorIDs.length === 0) {
      return res
        .status(400)
        .json({ message: "Request body must be an array of floorIDs" });
    }

    // Delete shops with the provided floor IDs
    const result = await Shops.deleteMany({ floorID: { $in: floorIDs } });

    // Check if any shops were deleted
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No shops found with the provided floor IDs" });
    }

    res
      .status(200)
      .json({
        message: "Shops deleted successfully",
        deletedCount: result.deletedCount,
      });
  } catch (error) {
    console.error("Error deleting shops:", error);
    res.status(500).json({ message: "Failed to delete shops", error });
  }
});

module.exports = router;
