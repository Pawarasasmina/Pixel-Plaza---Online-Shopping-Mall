const express = require("express");
const router = express.Router();
const PreviousOrder = require("../models/PreviousOrders");
const Income = require("../models/income");

// Utility function to calculate income (daily, monthly, yearly)
const calculateIncome = async (shopId, dateRange, groupByFields) => {
  return await PreviousOrder.aggregate([
    { $unwind: "$items" },
    {
      $match: {
        "items.shopID": shopId,
        date: {
          $gte: dateRange.startDate,
          $lt: dateRange.endDate,
        },
      },
    },
    {
      $group: {
        _id: groupByFields,
        totalIncome: { $sum: { $multiply: ["$items.price", "$items.count"] } },
        salesDetails: {
          $push: {
            itemId: "$items._id",
            itemName: "$items.name",
            price: "$items.price",
            quantity: "$items.count",
            totalSales: { $multiply: ["$items.price", "$items.count"] },
          },
        },
      },
    },
  ]);
};

// Calculate daily income for a specific shop and date
router.get("/dailyIncomeByShop", async (req, res) => {
  const { shopId, year, month, day } = req.query;

  if (!shopId || !year || !month || !day) {
    return res
      .status(400)
      .json({ error: "Shop ID, year, month, and day are required." });
  }

  try {
    const startDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endDate = new Date(year, month - 1, day, 23, 59, 59, 999);

    const incomeData = await calculateIncome(
      shopId,
      { startDate, endDate },
      {
        shopId: "$items.shopID",
        year: { $year: "$date" },
        month: { $month: "$date" },
        day: { $dayOfMonth: "$date" },
      }
    );

    if (incomeData.length > 0) {
      const newIncome = new Income({
        shopId,
        year,
        month,
        day,
        totalIncome: incomeData[0].totalIncome,
        salesDetails: incomeData[0].salesDetails,
      });

      await newIncome.save();
      res.status(200).json({
        message: "Daily income retrieved and saved successfully.",
        data: newIncome,
      });
    } else {
      res.status(404).json({
        message: "No sales data found for the provided shop and date.",
      });
    }
  } catch (err) {
    console.error("Error retrieving daily income for shop:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve daily income for the shop." });
  }
});

// Calculate monthly income for a specific shop and month
router.get("/monthlyIncomeByShop", async (req, res) => {
  const { shopId, year, month } = req.query;

  if (!shopId || !year || !month) {
    return res
      .status(400)
      .json({ error: "Shop ID, year, and month are required." });
  }

  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const incomeData = await calculateIncome(
      shopId,
      { startDate, endDate },
      {
        shopId: "$items.shopID",
        year: { $year: "$date" },
        month: { $month: "$date" },
      }
    );

    if (incomeData.length > 0) {
      const newIncome = new Income({
        shopId,
        year,
        month,
        totalIncome: incomeData[0].totalIncome,
        salesDetails: incomeData[0].salesDetails,
      });

      await newIncome.save();
      res.status(200).json({
        message: "Monthly income retrieved and saved successfully.",
        data: newIncome,
      });
    } else {
      res.status(404).json({
        message: "No sales data found for the provided shop and month.",
      });
    }
  } catch (err) {
    console.error("Error retrieving monthly income for shop:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve monthly income for the shop." });
  }
});

// Calculate yearly income for a specific shop and year
router.get("/yearlyIncomeByShop", async (req, res) => {
  const { shopId, year } = req.query;

  if (!shopId || !year) {
    return res.status(400).json({ error: "Shop ID and year are required." });
  }

  try {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const incomeData = await calculateIncome(
      shopId,
      { startDate, endDate },
      {
        shopId: "$items.shopID",
        year: { $year: "$date" },
      }
    );

    if (incomeData.length > 0) {
      res.status(200).json({
        message: "Yearly income retrieved successfully.",
        data: incomeData[0],
      });
    } else {
      res.status(404).json({
        message: "No sales data found for the provided shop and year.",
      });
    }
  } catch (err) {
    console.error("Error retrieving yearly income for shop:", err);
    res
      .status(500)
      .json({ error: "Failed to retrieve yearly income for the shop." });
  }
});

module.exports = router;
