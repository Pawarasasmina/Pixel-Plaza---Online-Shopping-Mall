const express = require('express');
const router = express.Router();
const PreviousOrder = require('../models/PreviousOrders');

// Add a new order after checkout
router.post('/', (req, res) => {
    PreviousOrder.create(req.body)
        .then(() => res.json({ msg: "Order successfully added to previous orders" }))
        .catch(() => res.status(400).json({ msg: "Order adding failed" }));
});

// Get all previous orders
router.get('/', (req, res) => {
    PreviousOrder.find()
        .then((orders) => res.json(orders))
        .catch(() => res.status(400).json({ msg: "Failed to retrieve previous orders" }));
});

// Get previous orders by userId
router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    PreviousOrder.find({ userId })  // Find orders by userId
        .then((orders) => {
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.status(404).json({ msg: "No previous orders found for this user" });
            }
        })
        .catch(() => res.status(400).json({ msg: "Failed to retrieve orders by userId" }));
});


router.get("/:id", async (req, res) => {
    try {
      const PreviousOrder = await PreviousOrder.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product", error: error.message });
    }
  });

  // Get a specific item by its itemId from previous orders
router.get('/item/:itemId', async (req, res) => {
    const { itemId } = req.params;

    try {
        // Search for the previous order that contains the item with the specified itemId
        const order = await PreviousOrder.findOne({
            'items._id': itemId, // Search for item with this ID in the items array
        },
        {
            items: { $elemMatch: { _id: itemId } } // Return only the matching item in the items array
        });

        if (!order) {
            return res.status(404).json({ msg: 'Item not found in previous orders' });
        }

        // Return the specific item that matches the itemId
        res.status(200).json(order.items[0]); // Since we're using $elemMatch, there will only be one item in the array
    } catch (error) {
        res.status(500).json({ msg: 'Error retrieving item', error: error.message });
    }
});


// Delete all previous orders
router.delete('/', (req, res) => {
    PreviousOrder.deleteMany() // Adjust this if you need to filter by user or other criteria
        .then(() => res.json({ msg: "All previous orders deleted successfully" }))
        .catch(() => res.status(400).json({ msg: "Failed to delete previous orders" }));
});

// Delete previous orders by userId
router.delete('/:userId', (req, res) => {
    const { userId } = req.params;

    PreviousOrder.deleteMany({ userId })  // Delete orders matching userId
        .then((result) => {
            if (result.deletedCount > 0) {
                res.json({ msg: "Previous orders deleted successfully for userId " + userId });
            } else {
                res.status(404).json({ msg: "No previous orders found for this user to delete" });
            }
        })
        .catch(() => res.status(400).json({ msg: "Failed to delete previous orders" }));
});

module.exports = router;
