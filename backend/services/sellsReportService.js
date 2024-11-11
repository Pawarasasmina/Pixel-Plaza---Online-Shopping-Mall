const PreviousOrder = require("../models/PreviousOrders");
const Income = require("../models/income");

// Function to calculate income daily-wise
const calculateDailyIncome = async () => {
  const dailyIncome = await PreviousOrder.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          shopId: "$items.shopID",
          year: { $year: "$date" },
          month: { $month: "$date" },
          day: { $dayOfMonth: "$date" },
        },
        totalIncome: { $sum: { $multiply: ["$items.price", "$items.count"] } },
        salesDetails: {
          $push: {
            itemId: "$items._id",
            quantity: "$items.count",
            totalSales: { $multiply: ["$items.price", "$items.count"] },
          },
        },
      },
    },
  ]);

  dailyIncome.forEach(async (incomeData) => {
    await Income.updateOne(
      {
        shopId: incomeData._id.shopId,
        year: incomeData._id.year,
        month: incomeData._id.month,
        day: incomeData._id.day,
      },
      {
        $set: {
          totalIncome: incomeData.totalIncome,
          salesDetails: incomeData.salesDetails,
        },
      },
      { upsert: true }
    );
  });
};

// Function to calculate monthly income
const calculateMonthlyIncome = async () => {
  const monthlyIncome = await PreviousOrder.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          shopId: "$items.shopID",
          year: { $year: "$date" },
          month: { $month: "$date" },
        },
        totalIncome: { $sum: { $multiply: ["$items.price", "$items.count"] } },
      },
    },
  ]);

  monthlyIncome.forEach(async (incomeData) => {
    await Income.updateOne(
      {
        shopId: incomeData._id.shopId,
        year: incomeData._id.year,
        month: incomeData._id.month,
      },
      { $set: { totalIncome: incomeData.totalIncome } },
      { upsert: true }
    );
  });
};

// Function to calculate yearly income
const calculateYearlyIncome = async () => {
  const yearlyIncome = await PreviousOrder.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: {
          shopId: "$items.shopID",
          year: { $year: "$date" },
        },
        totalIncome: { $sum: { $multiply: ["$items.price", "$items.count"] } },
      },
    },
  ]);

  yearlyIncome.forEach(async (incomeData) => {
    await Income.updateOne(
      { shopId: incomeData._id.shopId, year: incomeData._id.year },
      { $set: { totalIncome: incomeData.totalIncome } },
      { upsert: true }
    );
  });
};

// Function to analyze sales shop-wise
const analyzeSalesByShop = async () => {
  return await PreviousOrder.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.shopID",
        totalIncome: { $sum: { $multiply: ["$items.price", "$items.count"] } },
        totalQuantitySold: { $sum: "$items.count" },
      },
    },
  ]);
};

module.exports = {
  calculateDailyIncome,
  calculateMonthlyIncome,
  calculateYearlyIncome,
  analyzeSalesByShop,
};
