const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// JWT Secret Key
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "e933a2f6a85c7950edee4cb716e68706006e7510717ce6a2d58cfd4cec88c3ec6b604e09806e8f0e26ee3ae3e1f5537b89e800234903ea957bec8bb5e1365ec8"; // Use environment variable or fallback

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware to check user roles
const checkUserLevel = (requiredLevel) => {
  return (req, res, next) => {
    if (req.user.userLevel < requiredLevel) {
      return res
        .status(403)
        .json({ message: "Access denied, insufficient permissions" });
    }
    next();
  };
};

// Register a new user (customer)
router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password, // Store plain text password
      phone,
      userLevel: 0,
    });
    await user.save();

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Failed to register user:", error.message);
    res
      .status(400)
      .json({ message: "Failed to register user", error: error.message });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords directly (this should be hashed in a real application)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, userLevel: user.userLevel }, // Removed sellerId from token
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    let responseUser = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      userLevel: user.userLevel, // Include user level
      id: user.id, // id instead of _id for frontend
    };

    // Add shopId for sellers (userLevel === 1)
    if (user.userLevel === 1) {
      responseUser.shopId = user.shopId;
    }

    res.status(200).json({
      message: "Login successful",
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error("Failed to login user:", error.message);
    res
      .status(400)
      .json({ message: "Failed to login user", error: error.message });
  }
});

// Admin route to add a seller
router.post("/add-seller", verifyToken, checkUserLevel(2), async (req, res) => {
  const { name, email, password, phone, shopId } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new seller object
    const seller = new User({
      name,
      email,
      password, // Store plain text password (this should be hashed in a real application)
      phone,
      userLevel: 1, // Set userLevel to 1 for seller
      shopId, // Store shopId for the seller
    });

    // Save the seller (this will automatically trigger the pre-save hook to generate the custom ID)
    await seller.save();

    res.status(201).json({
      message: "Seller added successfully",
      seller: {
        id: seller.id, // The generated custom ID will be stored in seller.id
        name: seller.name,
        email: seller.email,
        phone: seller.phone,
        shopId: seller.shopId,
      },
    });
  } catch (error) {
    console.error("Failed to add seller:", error.message);
    res
      .status(400)
      .json({ message: "Failed to add seller", error: error.message });
  }
});

// Route to get user profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Failed to get user profile:", error.message);
    res
      .status(400)
      .json({ message: "Failed to get user profile", error: error.message });
  }
});
// Route to get user profile by ID
router.get("/profile/:id", async (req, res) => {
  const { id } = req.params; // Get the custom ID from the request parameters
  try {
    const user = await User.findOne({ id }).select("-password"); // Fetch the user by custom ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user); // Return the user details
  } catch (error) {
    console.error("Failed to get user profile by ID:", error.message);
    res
      .status(400)
      .json({ message: "Failed to get user profile", error: error.message });
  }
});

// Example of a protected route for admins
router.get("/admin", verifyToken, checkUserLevel(2), (req, res) => {
  res.status(200).json({ message: "Welcome, Admin!" });
});

// Get all users (admin-only)
router.get("/users", verifyToken, checkUserLevel(2), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Failed to retrieve users:", error.message);
    res
      .status(400)
      .json({ message: "Failed to retrieve users", error: error.message });
  }
});

// Admin route to create a new admin user
router.post(
  "/create-admin",
  verifyToken,
  checkUserLevel(2),
  async (req, res) => {
    const { name, email, password, phone } = req.body;

    try {
      const existingAdmin = await User.findOne({ email });
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const admin = new User({
        name,
        email,
        password, // Store plain text password
        phone,
        userLevel: 2, // Set userLevel to 2 for admin
      });

      await admin.save();

      const token = jwt.sign(
        { id: admin.id, userLevel: admin.userLevel },
        JWT_SECRET,
        {
          expiresIn: "1h", // Token expires in 1 hour
        }
      );

      res.status(201).json({
        message: "Admin created successfully",
        token,
        admin: {
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          userLevel: admin.userLevel,
          id: admin.id,
        },
      });
    } catch (error) {
      console.error("Failed to create admin:", error.message);
      res
        .status(400)
        .json({ message: "Failed to create admin", error: error.message });
    }
  }
);

// Admin route to create a new admin user
router.post("/create-admin-direct", async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = new User({
      name,
      email,
      password, // Store plain text password
      phone,
      userLevel: 2, // Set userLevel to 2 for admin
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin.id, userLevel: admin.userLevel },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    res.status(201).json({
      message: "Admin created successfully",
      token,
      admin: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        userLevel: admin.userLevel,
        id: admin.id,
      },
    });
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    res
      .status(400)
      .json({ message: "Failed to create admin", error: error.message });
  }
});

// Admin login or token generation for existing admin
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await User.findOne({ email, userLevel: 2 });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Compare passwords directly
    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin.id, userLevel: admin.userLevel },
      JWT_SECRET,
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: {
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        userLevel: admin.userLevel,
        id: admin.id,
      },
    });
  } catch (error) {
    console.error("Failed to login admin:", error.message);
    res
      .status(400)
      .json({ message: "Failed to login admin", error: error.message });
  }
});


module.exports = router;
