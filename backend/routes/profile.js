const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");
const FoundItem = require("../models/FoundItem");
const Claim = require("../models/Claim");

const isAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  next();
};

router.get("/stats", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    const groupByMonth = async (Model, match) => {
      return await Model.aggregate([
        { $match: match },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
      ]);
    };

    const lost = await groupByMonth(LostItem, { userId });
    const found = await groupByMonth(FoundItem, { userId });
    const resolved = await groupByMonth(Claim, {
      finderId: userId,
      status: "approved",
    });

    res.json({
      lost: lost || [],
      found: found || [],
      resolved: resolved || [],
    });
  } catch (err) {
    console.error("PROFILE STATS ERROR:", err);
    res.status(500).json({
      lost: [],
      found: [],
      resolved: [],
    });
  }
});

module.exports = router;
