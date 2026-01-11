const mongoose = require("mongoose");
const LedgerEntry = require("../models/LedgerEntry");

exports.getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId" });
    }

    // ✅ Use LedgerEntry as source of truth
    const entries = await LedgerEntry.find({
      groupId,
      status: "ACTIVE",
      type: "EXPENSE_CREATED",
    })
      .sort({ createdAt: -1 })
      .populate("data.payer", "username")
      .populate("actor", "username");

    const expenses = entries.map((e) => ({
      _id: e.data?.referenceId || e._id,
      title: e.data?.title || "Expense",
      amount: Number(e.data?.amount || 0),
      paidBy: e.data?.payer
        ? {
            _id: e.data.payer._id,
            username: e.data.payer.username,
          }
        : null,
      splitBetween: e.data?.participants || [],
      createdAt: e.createdAt,
    }));

    return res.status(200).json({ expenses });
  } catch (err) {
    console.error("Get group expenses error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
