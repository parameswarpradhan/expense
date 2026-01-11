const mongoose = require("mongoose");
const LedgerEntry = require("../models/LedgerEntry");
const Group = require("../models/group");

exports.getSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId" });
    }

    // ✅ Load group + members
    const group = await Group.findById(groupId).populate("members", "username email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    // ✅ Map userId -> username
    const memberMap = {};
    group.members.forEach((m) => {
      memberMap[m._id.toString()] = m.username;
    });

    // ✅ Ledger includes settlements
    const ledgerEntries = await LedgerEntry.find({
      groupId,
      status: "ACTIVE",
      type: { $in: ["EXPENSE_CREATED", "SETTLEMENT_COMPLETED"] },
    });

    const balances = {};

    for (const entry of ledgerEntries) {
      // ✅ Expense
      if (entry.type === "EXPENSE_CREATED") {
        const payerId = entry.data?.payer?.toString();
        const amount = Number(entry.data?.amount || 0);

        if (!payerId || amount <= 0) continue;

        balances[payerId] = (balances[payerId] || 0) + amount;

        let splitObj = entry.data?.splits || {};
        if (splitObj instanceof Map) splitObj = Object.fromEntries(splitObj);

        for (const userId of Object.keys(splitObj || {})) {
          balances[userId] = (balances[userId] || 0) - Number(splitObj[userId]);
        }
      }

      // ✅ Settlement completed
      else if (entry.type === "SETTLEMENT_COMPLETED") {
        const fromId = entry.data?.from?.toString();
        const toId = entry.data?.to?.toString();
        const amt = Number(entry.data?.amount || 0);

        if (!fromId || !toId || amt <= 0) continue;

        balances[fromId] = (balances[fromId] || 0) + amt;
        balances[toId] = (balances[toId] || 0) - amt;
      }
    }

    // ✅ creditors / debtors
    const creditors = [];
    const debtors = [];

    for (const userId in balances) {
      const bal = Number(balances[userId] || 0);

      if (bal > 0.00001) creditors.push({ userId, amount: bal });
      else if (bal < -0.00001) debtors.push({ userId, amount: Math.abs(bal) });
    }

    // ✅ settlements
    const settlements = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amount, creditors[j].amount);

      settlements.push({
        fromId: debtors[i].userId,
        fromName: memberMap[debtors[i].userId] || debtors[i].userId,

        toId: creditors[j].userId,
        toName: memberMap[creditors[j].userId] || creditors[j].userId,

        amount: Math.round(pay * 100) / 100,
      });

      debtors[i].amount -= pay;
      creditors[j].amount -= pay;

      if (debtors[i].amount <= 0.00001) i++;
      if (creditors[j].amount <= 0.00001) j++;
    }

    // ✅ summary
    const myId = req.user?._id?.toString();
    const myBal = myId ? Number(balances[myId] || 0) : 0;

    return res.status(200).json({
      groupId,
      groupName: group.name,
      members: group.members.map((m) => ({ _id: m._id, username: m.username })),
      balances,
      summary: {
        youGet: myBal > 0 ? Math.round(myBal * 100) / 100 : 0,
        youOwe: myBal < 0 ? Math.round(Math.abs(myBal) * 100) / 100 : 0,
      },
      settlements,
    });
  } catch (error) {
    console.error("Settlement error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
