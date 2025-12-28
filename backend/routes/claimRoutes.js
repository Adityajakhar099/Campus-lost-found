const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");
const FoundItem = require("../models/FoundItem");
const { generateClaimQuestions } = require("../utils/gemini");

/* ================= AUTH ================= */
const isAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  next();
};

/* ================= CREATE CLAIM ================= */
router.post("/create", isAuth, async (req, res) => {
  try {
    const { itemId } = req.body;

    const item = await FoundItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.status !== "found")
      return res.status(400).json({ message: "Item not available" });

    // 🔒 Prevent duplicate claim by same user
    const alreadyClaimed = await Claim.findOne({
      itemId,
      claimerId: req.user._id,
    });

    if (alreadyClaimed) {
      return res.json({
        claimId: alreadyClaimed._id,
        questions: alreadyClaimed.questions,
      });
    }

    const questions = await generateClaimQuestions(
      item.itemName,
      item.description
    );

    const claim = await Claim.create({
      itemId,
      claimerId: req.user._id,
      finderId: item.userId,
      questions,
      messages: [{ sender: "system", text: "Claim created" }],
    });

    // ✅ Mark item as CLAIMED
    await FoundItem.findByIdAndUpdate(itemId, {
      status: "claimed",
    });

    res.json({ claimId: claim._id, questions });
  } catch (err) {
    console.error("CREATE CLAIM ERROR:", err);
    res.status(500).json({ message: "Failed to create claim" });
  }
});

/* ================= SUBMIT ANSWERS ================= */
router.post("/answer", isAuth, async (req, res) => {
  try {
    const { claimId, answers } = req.body;

    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ message: "Claim not found" });

    if (claim.claimerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });

    claim.answers = answers;
    claim.status = "answered";

    claim.messages.push({
      sender: "system",
      text: "Claimer submitted answers",
    });

    await claim.save();
    res.json({ message: "Answers saved" });
  } catch (err) {
    console.error("ANSWER ERROR:", err);
    res.status(500).json({ message: "Failed to save answers" });
  }
});

/* ================= GET CHAT ================= */
router.get("/chat/:id", isAuth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    res.json(claim?.messages || []);
  } catch (err) {
    res.status(500).json([]);
  }
});

/* ================= SEND MESSAGE ================= */
router.post("/chat/:id", isAuth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Not found" });

    const sender =
      req.user._id.toString() === claim.claimerId.toString()
        ? "claimer"
        : "finder";

    claim.messages.push({ sender, text: req.body.message });
    await claim.save();

    res.json({ message: "Message sent" });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.status(500).json({ message: "Chat failed" });
  }
});

/* ================= RECEIVED CLAIMS ================= */
router.get("/received", isAuth, async (req, res) => {
  try {
    const claims = await Claim.find({
      finderId: req.user._id,
      status: { $in: ["created", "answered"] },
    })
      .populate("itemId")
      .populate("claimerId");

    res.json(claims);
  } catch (err) {
    console.error("RECEIVED CLAIMS ERROR:", err);
    res.status(500).json([]);
  }
});

/* ================= SENT CLAIMS ================= */
router.get("/sent", isAuth, async (req, res) => {
  try {
    const claims = await Claim.find({
      claimerId: req.user._id,
    }).populate("itemId");

    res.json(claims);
  } catch (err) {
    console.error("SENT CLAIMS ERROR:", err);
    res.status(500).json([]);
  }
});

/* ================= APPROVE CLAIM ================= */
router.post("/approve/:id", isAuth, async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: "Not found" });

    if (claim.finderId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });

    claim.status = "approved";
    claim.messages.push({
      sender: "system",
      text: "Claim approved by finder",
    });

    await claim.save();

    // ✅ Mark item as RESOLVED
    await FoundItem.findByIdAndUpdate(claim.itemId, {
      status: "resolved",
    });

    res.json({ message: "Approved" });
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ message: "Approval failed" });
  }
});

module.exports = router;
