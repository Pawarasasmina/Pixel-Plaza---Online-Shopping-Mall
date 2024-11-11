const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables

const app = express();
const port = 3000;

// Configure CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with the URL of your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://Yehara:S123@cluster0.y694y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const promotionRoutes = require("./routes/promotionRoutes");
app.use("/api/promotions", promotionRoutes);

const userRoutes = require("./routes/userRoutes"); // Import userRoutes
app.use("/api/users", userRoutes); // Use the userRoutes for the /api/users endpoint

const salesRoutes = require("./routes/shops");
app.use("/api/shops", salesRoutes);

const cartproductRoutes = require("./routes/cartproductRoutes");
app.use("/api/cartProduct", cartproductRoutes);

const previousOrderRoutes = require("./routes/previousOrderRoutes");
app.use("/api/previousOrders", previousOrderRoutes);

const wishlistRoutes = require("./routes/wishlistRoutes");
app.use("/api/wishlist", wishlistRoutes);

const feedback = require("./routes/feedback");
app.use("/api/feedback", feedback);

const sellsReportRoutes = require("./routes/sellsReport");
app.use("/api/sells", sellsReportRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
