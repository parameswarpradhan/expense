const mongoose = require("mongoose");
const LedgerEntry = require("../models/LedgerEntry");

exports.markPaid = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { fromId, toId, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId" });
    }
    if (!mongoose.Types.ObjectId.isValid(fromId) || !mongoose.Types.ObjectId.isValid(toId)) {
      return res.status(400).json({ message: "Invalid fromId or toId" });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const entry = await LedgerEntry.create({
      groupId,
      type: "SETTLEMENT_COMPLETED",
      actor: req.user._id, // who clicked mark paid
      data: {
        from: fromId,
        to: toId,
        amount: Number(amount),
      },
      status: "ACTIVE",
    });

    return res.status(201).json({
      message: "Settlement marked paid",
      ledgerEntryId: entry._id,
    });
  } catch (error) {
    console.error("Mark paid error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
