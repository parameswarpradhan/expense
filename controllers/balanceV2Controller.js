const mongoose = require("mongoose");
const LedgerEntry = require("../models/LedgerEntry");

exports.getGroupBalancesV2 = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const myId = req.user._id.toString();

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId" });
    }

    const ledgerEntries = await LedgerEntry.find({
      groupId,
      status: "ACTIVE",
      type: { $in: ["EXPENSE_CREATED", "SETTLEMENT_COMPLETED"] },
    });

    const balances = {};

    for (const entry of ledgerEntries) {
      // ✅ EXPENSE
      if (entry.type === "EXPENSE_CREATED") {
        const payer = entry.data.payer.toString();
        const amount = Number(entry.data.amount || 0);

        balances[payer] = (balances[payer] || 0) + amount;

        let splitObj = entry.data.splits;
        if (splitObj instanceof Map) splitObj = Object.fromEntries(splitObj);

        for (const [uid, share] of Object.entries(splitObj || {})) {
          balances[uid] = (balances[uid] || 0) - Number(share || 0);
        }
      }

      // ✅ SETTLEMENT COMPLETED
      if (entry.type === "SETTLEMENT_COMPLETED") {
        const fromId = entry.data.from?.toString();
        const toId = entry.data.to?.toString();
        const amt = Number(entry.data.amount || 0);

        if (!fromId || !toId || !amt) continue;

        balances[fromId] = (balances[fromId] || 0) + amt;
        balances[toId] = (balances[toId] || 0) - amt;
      }
    }

    const myBal = Number(balances[myId] || 0);

    return res.status(200).json({
      balances,
      youGet: myBal > 0 ? Number(myBal.toFixed(2)) : 0,
      youOwe: myBal < 0 ? Number(Math.abs(myBal).toFixed(2)) : 0,
      net: Number(myBal.toFixed(2)),
    });
  } catch (error) {
    console.error("Balance v2 error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
