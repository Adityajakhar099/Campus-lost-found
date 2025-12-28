const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    itemName: String,
    description: String,
    locationName: String,
    latitude: Number,
    longitude: Number,
    image: String, // image filename
    dateLost: Date,
    status: {
      type: String,
      default: "lost",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostItem", lostItemSchema);
