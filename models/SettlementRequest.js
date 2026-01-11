const mongoose = require("mongoose");

const settlementRequestSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true, index: true },

    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // debtor
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // creditor

    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "REJECTED"],
      default: "PENDING",
      index: true,
    },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who clicked
  },
  { timestamps: true }
);

// ✅ prevents duplicate request for same from-to-amount while pending
settlementRequestSchema.index(
  { groupId: 1, from: 1, to: 1, amount: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "PENDING" } }
);

module.exports = mongoose.model("SettlementRequest", settlementRequestSchema);
