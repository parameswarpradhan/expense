const mongoose = require("mongoose");
const LedgerEntry = require("../models/LedgerEntry");
exports.getGroupBalancesV2 = async (req, res) => {
  try {
    const { groupId } = req.params;

    // -------- VALIDATION --------
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId" });
    }

    // -------- FETCH LEDGER ENTRIES --------
    const ledgerEntries = await LedgerEntry.find({
      groupId,
      status: "ACTIVE",
      type: "EXPENSE_CREATED"
    });

    // -------- COMPUTE BALANCES --------
    const balances = {};

    for (const entry of ledgerEntries) {
      const { payer, splits } = entry.data;

      // Credit payer
      if (!balances[payer]) balances[payer] = 0;
      balances[payer] += entry.data.amount;

      // Debit participants
      for (const [userId, amount] of splits.entries()) {
        if (!balances[userId]) balances[userId] = 0;
        balances[userId] -= amount;
      }
    }

    return res.status(200).json({ balances });

  } catch (error) {
    console.error("Balance v2 error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
