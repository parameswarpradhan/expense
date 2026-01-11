const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      index: true,
    },

    // ✅ More granular notification types
    type: {
      type: String,
      enum: [
        "INFO",
        "EXPENSE_CREATED",

        "SETTLEMENT_REQUEST",
        "SETTLEMENT_CONFIRMED",
        "SETTLEMENT_REJECTED",

        "REMINDER",
      ],
      default: "INFO",
      index: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
