const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ["claimer", "finder", "system"],
      required: true,
    },
    text: String,
  },
  { timestamps: true }
);

const claimSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "FoundItem", required: true },
    claimerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    finderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    questions: [String],
    answers: Object,

    status: {
      type: String,
      enum: ["created", "answered", "approved"],
      default: "created",
    },

    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Claim", claimSchema);
