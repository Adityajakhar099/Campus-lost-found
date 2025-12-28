const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema(
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
    image: String,
    dateFound: Date,
    status: {
  type: String,
  enum: ["found", "claimed", "resolved"],
  default: "found",
},

  },
  { timestamps: true }
);

module.exports = mongoose.model("FoundItem", foundItemSchema);
