const mongoose = require("mongoose");
const LedgerEntry = require("../models/LedgerEntry");
const Notification = require("../models/Notification");
const Group = require("../models/group");
const { getIO } = require("../socket");

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

    // ✅ ledger settlement entry
    const entry = await LedgerEntry.create({
      groupId,
      type: "SETTLEMENT_COMPLETED",
      actor: req.user._id,
      data: {
        from: fromId,
        to: toId,
        amount: Number(amount),
      },
      status: "ACTIVE",
    });

    // ✅ group name
    const group = await Group.findById(groupId).select("name");

    // ✅ create notifications for both parties
    const note1 = await Notification.create({
      groupId,
      userId: fromId,
      type: "SETTLEMENT_COMPLETED",
      message: `✅ Payment of ₹${amount} marked paid in group "${group?.name || "Group"}"`,
      meta: { groupId, fromId, toId, amount },
    });

    const note2 = await Notification.create({
      groupId,
      userId: toId,
      type: "SETTLEMENT_COMPLETED",
      message: `✅ You received ₹${amount} in group "${group?.name || "Group"}"`,
      meta: { groupId, fromId, toId, amount },
    });

    // ✅ realtime emit
    const io = getIO();
    io.to(groupId.toString()).emit("notification:new", {
      groupId: groupId.toString(),
      notification: note1,
    });
    io.to(groupId.toString()).emit("notification:new", {
      groupId: groupId.toString(),
      notification: note2,
    });

    io.to(groupId.toString()).emit("settlement_completed", {
      groupId: groupId.toString(),
      fromId,
      toId,
      amount,
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
