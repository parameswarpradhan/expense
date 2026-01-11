const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },

    splits: {
      type: Map,
      of: Number,
      required: true
    },

    state: {
      type: String,
      enum: ["CREATED", "MODIFIED", "ARCHIVED"],
      default: "CREATED"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("transaction", transactionSchema);
