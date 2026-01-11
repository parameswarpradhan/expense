const mongoose = require("mongoose");
const LedgerEntry = require("../models/LedgerEntry");

exports.getGroupBalancesV2 = async (req, res) => {
  try {
    const groupId = req.params.groupId || req.query.groupId || req.body.groupId;
    const myId = req.user._id.toString();

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId" });
    }

    // ✅ read both EXPENSE + SETTLEMENT_COMPLETED
    const ledgerEntries = await LedgerEntry.find({
      groupId,
      status: "ACTIVE",
      type: { $in: ["EXPENSE_CREATED", "SETTLEMENT_COMPLETED"] },
    });

    const balances = {};

    for (const entry of ledgerEntries) {
      // ✅ EXPENSE LOGIC
      if (entry.type === "EXPENSE_CREATED") {
        const payerId = entry.data?.payer?.toString();
        const amount = Number(entry.data?.amount || 0);

        if (!payerId || amount <= 0) continue;

        // payer gets credited
        balances[payerId] = (balances[payerId] || 0) + amount;

        // splits may be Map or object
        let splitObj = entry.data?.splits || {};
        if (splitObj instanceof Map) splitObj = Object.fromEntries(splitObj);

        // everyone gets debited for their share
        for (const [uid, share] of Object.entries(splitObj || {})) {
          const s = Number(share || 0);
          balances[uid] = (balances[uid] || 0) - s;
        }
      }

      // ✅ SETTLEMENT LOGIC
      else if (entry.type === "SETTLEMENT_COMPLETED") {
        const fromId = entry.data?.from?.toString();
        const toId = entry.data?.to?.toString();
        const amt = Number(entry.data?.amount || 0);

        if (!fromId || !toId || amt <= 0) continue;

        // debtor pays => increases their balance (less negative)
        balances[fromId] = (balances[fromId] || 0) + amt;

        // creditor receives => decreases their balance (less positive)
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
