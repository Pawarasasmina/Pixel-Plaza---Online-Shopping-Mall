const express = require("express");

const router = express.Router();

const Feedback = require("../models/review");

router.get("/test", (req, res) => res.send("Customer routes waiting"));

// Create a feedback
router.post("/", async (req, res) => {
    try {
        const review = await Feedback.create(req.body);
        res.json({ msg: "Review added successfully" , review});
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ msg: "Failed to add review" });
    }
});

// Get all feedback
router.get("/", async (req, res) => {
    try {
        const reviews = await Feedback.find();
        res.json(reviews);
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ msg: "No reviews found" });
    }
});
router.get('/:userId', (req, res) => {
    const { userId } = req.params;

    Feedback.find({ userId })  // Find orders by userId
        .then((orders) => {
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.status(404).json({ msg: "No reviews found for this user" });
            }
        })
        .catch(() => res.status(400).json({ msg: "Failed to retrieve reviews by userId" }));
});

// Get loyalty status based on feedback count for a user
router.get('/loyalty/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const feedbackCount = await Feedback.countDocuments({ userId });
        let loyaltyStatus = '';

        if (feedbackCount >= 0 && feedbackCount <= 2) {
            loyaltyStatus = 'Blue Member';
        } else if (feedbackCount > 2 && feedbackCount <= 5) {
            loyaltyStatus = 'Gold Member';
        } else if (feedbackCount > 5) {
            loyaltyStatus = 'Platinum Member';
        }

        res.json({ feedbackCount, loyaltyStatus });
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ msg: "Failed to retrieve loyalty status" });
    }
});


// Get a review by ID
router.get("/:id", async (req, res) => {
    try {
        const review = await Feedback.findById(req.params.id);
        if (review) {
            res.json(review);
        } else {
            res.status(400).json({ msg: "Review not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ msg: "Cannot find this review" });
    }
});

// Update a review by ID
router.put("/:id", async (req, res) => {
    try {
        const review = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (review) {
            res.json({ msg: "Review updated successfully", review });
        } else {
            res.status(400).json({ msg: "Review not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ msg: "Failed to update review" });
    }
});

// Delete a review by ID
router.delete("/:id", async (req, res) => {
    try {
        const review = await Feedback.findByIdAndDelete(req.params.id);
        if (review) {
            res.json({ msg: "Review deleted successfully", review });
        } else {
            res.status(400).json({ msg: "Review not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(400).json({ msg: "Failed to delete review" });
    }
});

module.exports = router;