const express = require("express");
const router = express.Router();
const FoundItem = require("../models/FoundItem");
const upload = require("../middleware/upload"); // same multer middleware
const isAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "User not authenticated" });
  next();
};

/* ==============================
   REPORT FOUND ITEM
================================ */
router.post("/report-found", upload.single("image"), isAuth, async (req, res) => {
  try {
    const { itemName, description, locationName, latitude, longitude, dateFound } = req.body;

    const foundItem = new FoundItem({
      userId: req.user._id,
      itemName,
      description,
      locationName,
      latitude,
      longitude,
      dateFound,
      image: req.file?.filename,
    });

    await foundItem.save();
    res.json({ message: "Found item reported successfully" });
  } catch (err) {
    console.error("❌ REPORT FOUND ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   RECENT FOUND ITEMS
================================ */
router.get("/recent-found", isAuth, async (req, res) => {
  try {
    const recentItems = await FoundItem.find({ userId: req.user._id });
    res.json(recentItems);
  } catch (err) {
    console.error("❌ RECENT FOUND ITEMS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   ALL FOUND ITEMS
================================ */
router.get("/found-items", async (req, res) => {
  try {
    const items = await FoundItem.find({ status: "found" }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("❌ FOUND ITEMS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/found-items/:id", async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error("❌ FETCH FOUND ITEM ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===========================
   SINGLE FOUND ITEM
=========================== */
router.get("/found-items/:id", async (req, res) => {
  try {
    const item = await FoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
