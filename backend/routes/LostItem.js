const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");
const upload = require("../middleware/upload");

// AUTH CHECK
const isAuth = (req, res, next) => {
  if (!req.user) {
    console.log("❌ Not authenticated");
    return res.status(401).json({ message: "User not authenticated" });
  }
  next();
};

/* ==============================
   TEST ROUTE (VERY IMPORTANT)
================================ */
router.get("/test", (req, res) => {
  console.log("✅ /api/test HIT");
  res.json({ message: "API working" });
});

/* ==============================
   REPORT LOST ITEM
================================ */
router.post(
  "/report-lost",
  upload.single("image"),
  isAuth,
  async (req, res) => {
    try {
      console.log("✅ /api/report-lost HIT");

      const { itemName, description, locationName, latitude, longitude, dateLost } =
        req.body;

      const lostItem = new LostItem({
        userId: req.user._id,
        itemName,
        description,
        locationName,
        latitude,
        longitude,
        dateLost,
        image: req.file?.filename,
      });

      await lostItem.save();
      res.json({ message: "Lost item reported successfully" });
    } catch (err) {
      console.error("❌ REPORT LOST ERROR:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

/* ==============================
   RECENT LOST ITEMS
================================ */
router.get("/recent-lost", isAuth, async (req, res) => {
  console.log("LOGGED IN USER ID:", req.user._id);
  console.log("LOGGED IN USER EMAIL:", req.user.email);

  const recentItems = await LostItem.find({ userId: req.user._id });

  console.log("ITEM COUNT FOUND:", recentItems.length);
  console.log(
    "ITEM USER IDS:",
    recentItems.map(i => i.userId.toString())
  );

  res.json(recentItems);
});


/* ==============================
   ALL LOST ITEMS (THIS WAS MISSING)
================================ */
router.get("/lost-items", async (req, res) => {
  try {
    console.log("✅ /api/lost-items HIT");

    const items = await LostItem.find({ status: "lost" }).sort({
      createdAt: -1,
    });

    console.log("Items found:", items.length);
    res.json(items);
  } catch (err) {
    console.error("❌ LOST ITEMS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/lost-items/:id", async (req, res) => {
  try {
    console.log("Fetching item with ID:", req.params.id);

    const item = await LostItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (err) {
    console.error("Error fetching item:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
