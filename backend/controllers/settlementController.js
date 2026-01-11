const mongoose = require("mongoose");
const LedgerEntry = require("../models/LedgerEntry");
const Group = require("../models/group");
const SettlementRequest = require("../models/SettlementRequest");

exports.getSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId" });
    }

    // ✅ Load group + members
    const group = await Group.findById(groupId).populate(
      "members",
      "username email"
    );

    if (!group) return res.status(404).json({ message: "Group not found" });

    // ✅ member map
    const memberMap = {};
    group.members.forEach((m) => {
      memberMap[m._id.toString()] = m.username;
    });

    // ✅ Load ledger entries for balances
    const ledgerEntries = await LedgerEntry.find({
      groupId,
      status: "ACTIVE",
      type: { $in: ["EXPENSE_CREATED", "SETTLEMENT_COMPLETED"] },
    });

    // ✅ Compute balances
    const balances = {};

    for (const entry of ledgerEntries) {
      // ✅ EXPENSE CREATED
      if (entry.type === "EXPENSE_CREATED") {
        const { payer, splits, amount } = entry.data;

        const payerId = payer.toString();
        balances[payerId] = (balances[payerId] || 0) + Number(amount);

        const splitObj =
          splits instanceof Map ? Object.fromEntries(splits) : splits;

        for (const userId of Object.keys(splitObj || {})) {
          balances[userId] =
            (balances[userId] || 0) - Number(splitObj[userId]);
        }
      }

      // ✅ SETTLEMENT COMPLETED
      if (entry.type === "SETTLEMENT_COMPLETED") {
        const fromId = entry.data.from?.toString();
        const toId = entry.data.to?.toString();
        const amt = Number(entry.data.amount || 0);

        if (!fromId || !toId || !amt) continue;

        // debtor pays -> less negative
        balances[fromId] = (balances[fromId] || 0) + amt;

        // creditor receives -> less positive
        balances[toId] = (balances[toId] || 0) - amt;
      }
    }

    // ✅ creditors / debtors
    const creditors = [];
    const debtors = [];

    for (const userId in balances) {
      const bal = balances[userId];

      if (bal > 0.00001) creditors.push({ userId, amount: bal });
      else if (bal < -0.00001) debtors.push({ userId, amount: Math.abs(bal) });
    }

    // ✅ logged user summary
    const myId = req.user?._id?.toString();
    const myBal = myId ? Number(balances[myId] || 0) : 0;

    // =====================================================
    // ✅ Pending requests
    // =====================================================
    const pendingRequests = await SettlementRequest.find({
      groupId,
      status: "PENDING",
    }).populate("from to", "username");

    // ✅ create lookup for pending: from-to-amount
    const pendingLookup = new Map();
    pendingRequests.forEach((p) => {
      const fromId = p.from._id.toString();
      const toId = p.to._id.toString();
      const amt = Math.round(Number(p.amount) * 100) / 100;
      const key = `${fromId}-${toId}-${amt}`;
      pendingLookup.set(key, p._id.toString());
    });

    const pending = pendingRequests.map((p) => {
      const fromId = p.from._id.toString();
      const toId = p.to._id.toString();
      const amt = Math.round(Number(p.amount) * 100) / 100;

      return {
        _id: p._id,
        fromId,
        fromName: p.from.username,
        toId,
        toName: p.to.username,
        amount: amt,
        confirmStatus: p.status,

        // ✅ permissions
        canConfirm: myId === toId, // receiver can confirm/reject
        canRequest: myId === fromId, // debtor created it
      };
    });

    // =====================================================
    // ✅ Settlement suggestions (ENRICHED)
    // =====================================================
    const settlements = [];
    let i = 0,
      j = 0;

    while (i < debtors.length && j < creditors.length) {
      const pay = Math.min(debtors[i].amount, creditors[j].amount);

      const fromId = debtors[i].userId;
      const toId = creditors[j].userId;
      const roundedAmount = Math.round(pay * 100) / 100;

      // ✅ check if pending exists already
      const key = `${fromId}-${toId}-${roundedAmount}`;
      const pendingId = pendingLookup.get(key) || null;

      settlements.push({
        fromId,
        fromName: memberMap[fromId] || fromId,

        toId,
        toName: memberMap[toId] || toId,

        amount: roundedAmount,

        // ✅ new fields for frontend button logic
        hasPendingRequest: !!pendingId,
        pendingRequestId: pendingId,

        // ✅ permissions
        canRequestPaid: myId === fromId && !pendingId,
        canRemind: myId === toId,
      });

      debtors[i].amount -= pay;
      creditors[j].amount -= pay;

      if (debtors[i].amount <= 0.00001) i++;
      if (creditors[j].amount <= 0.00001) j++;
    }

    // ✅ FINAL RESPONSE
    return res.status(200).json({
      groupId,
      groupName: group.name,

      members: group.members.map((m) => ({
        _id: m._id,
        username: m.username,
      })),

      balances,

      summary: {
        youGet: myBal > 0 ? Math.round(myBal * 100) / 100 : 0,
        youOwe: myBal < 0 ? Math.round(Math.abs(myBal) * 100) / 100 : 0,
      },

      settlements,
      pending,
    });
  } catch (error) {
    console.error("Settlement error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
