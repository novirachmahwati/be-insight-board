const Customer = require("../models/customerModel");

exports.getTotalCustomers = async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    res.json({ totalCustomers: count });
  } catch (error) {
    res.status(500).json({ error: "Failed to get total customers" });
  }
};

exports.getTotalLocations = async (req, res) => {
  try {
    const locations = await Customer.distinct("Name of Location");
    res.json({ totalLocations: locations.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to get total locations" });
  }
};

exports.getAverageAge = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const result = await Customer.aggregate([
      {
        $group: {
          _id: null,
          averageAge: { $avg: { $subtract: [currentYear, "$Age"] } },
        },
      },
    ]);

    res.json({ averageAge: Math.round(result[0]?.averageAge || 0) });
  } catch (error) {
    res.status(500).json({ error: "Failed to get average age" });
  }
};

exports.getLoginTrends = async (req, res) => {
  try {
    const result = await Customer.aggregate([
      {
        $addFields: {
          parsedDate: {
            $dateFromString: {
              dateString: "$Date",
              format: "%m/%d/%Y",
            },
          },
        },
      },
      {
        $addFields: {
          dayOfWeek: { $dayOfWeek: "$parsedDate" },
        },
      },
      {
        $group: {
          _id: "$dayOfWeek",
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const dayMap = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thursday",
      6: "Friday",
      7: "Saturday",
    };

    const formatted = result.map((item) => ({
      day: dayMap[item._id],
      total: item.total,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Failed to get login trends" });
  }
};

exports.getLoginPerLocation = async (req, res) => {
  try {
    const result = await Customer.aggregate([
      {
        $group: {
          _id: "$Name of Location",
          total: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    const formatted = result.map((item) => ({
      location: item._id,
      total: item.total,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: "Failed to get login per location" });
  }
};

exports.getRecentLogins = async (req, res) => {
  try {
    const data = await Customer.find(
      {},
      {
        Name: 1,
        Email: 1,
        "Name of Location": 1,
        "Brand Device": 1,
        Date: 1,
        "Login Hour": 1,
      }
    )
      .sort({ Date: -1, "Login Hour": -1 })
      .limit(5);

    const result = data.map((item) => ({
      name: item.Name,
      email: item.Email,
      location: item["Name of Location"],
      device: item["Brand Device"],
      login_time: `${item.Date} ${item["Login Hour"]}`,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to get recent logins" });
  }
};

exports.getMostPopularLocation = async (req, res) => {
  try {
    const total = await Customer.countDocuments();

    const topLocation = await Customer.aggregate([
      {
        $group: {
          _id: "$Name of Location",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    if (!topLocation.length) {
      return res.status(404).json({ error: "No data found" });
    }

    const location = topLocation[0]._id;
    const percentage = ((topLocation[0].count / total) * 100).toFixed(2);

    res.json({
      location,
      percentage: Number(percentage),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get most popular location" });
  }
};

exports.getMostUsedDeviceBrand = async (req, res) => {
  try {
    const total = await Customer.countDocuments();

    const topDevice = await Customer.aggregate([
      {
        $group: {
          _id: "$Brand Device",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    if (!topDevice.length) {
      return res.status(404).json({ error: "No data found" });
    }

    const brand = topDevice[0]._id;
    const percentage = ((topDevice[0].count / total) * 100).toFixed(2);

    res.json({
      brand,
      percentage: Number(percentage),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get most used device brand" });
  }
};

exports.getTopDigitalInterest = async (req, res) => {
  try {
    const total = await Customer.countDocuments();

    const topInterest = await Customer.aggregate([
      {
        $group: {
          _id: "$Digital Interest",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    if (!topInterest.length) {
      return res.status(404).json({ error: "No data found" });
    }

    const interest = topInterest[0]._id;
    const percentage = ((topInterest[0].count / total) * 100).toFixed(2);

    res.json({
      interest,
      percentage: Number(percentage),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get top digital interest" });
  }
};

exports.getGenderDistribution = async (req, res) => {
  try {
    const genderStats = await Customer.aggregate([
      {
        $group: {
          _id: "$gender",
          count: { $sum: 1 },
        },
      },
    ]);

    const result = genderStats.map((item) => ({
      gender: item._id,
      count: item.count,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to get gender distribution" });
  }
};
