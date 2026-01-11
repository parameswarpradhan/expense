const mongoose = require("mongoose");
const ledgerEntrySchema = new mongoose.Schema(
{
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: [
      "EXPENSE_CREATED",
      "EXPENSE_ADJUSTED",
      "EXPENSE_REVERSED",
      "SETTLEMENT_CREATED",
      "SETTLEMENT_COMPLETED"
    ],
    required: true
  },
  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  data: {
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  splits: {
    type: Map,
    of: Number
  },
  amount: {
    type: Number
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  },

  // ✅ NEW FOR SETTLEMENTS
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
},

  status: {
    type: String,
    enum: ["ACTIVE", "DISPUTED", "REVERSED"],
    default: "ACTIVE"
  }
},
{
  timestamps: true
}
);
ledgerEntrySchema.index(
  { groupId: 1, type: 1, "data.referenceId": 1 },
  { unique: true, partialFilterExpression: { type: "EXPENSE_CREATED" } }
);

module.exports = mongoose.model("LedgerEntry", ledgerEntrySchema);
