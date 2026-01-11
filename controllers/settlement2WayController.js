const mongoose = require("mongoose");
const SettlementRequest = require("../models/SettlementRequest");
const LedgerEntry = require("../models/LedgerEntry");
const Notification = require("../models/Notification");
const { getIO } = require("../socket");

/**
 * ✅ Helper: emit notification to specific user room
 */
async function emitNotificationToUser(userId, notificationDoc) {
  const io = getIO();
  io.to(userId.toString()).emit("notification", notificationDoc);
}

exports.requestSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { fromId, toId, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId))
      return res.status(400).json({ message: "Invalid groupId" });

    if (
      !mongoose.Types.ObjectId.isValid(fromId) ||
      !mongoose.Types.ObjectId.isValid(toId)
    )
      return res.status(400).json({ message: "Invalid fromId or toId" });

    if (!amount || Number(amount) <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const loggedUser = req.user._id.toString();

    // ✅ Only debtor can request
    if (loggedUser !== fromId.toString()) {
      return res
        .status(403)
        .json({ message: "Only debtor can request settlement." });
    }

    /**
     * ✅ Prevent duplicate request
     * Better check: only ONE pending request allowed between same debtor & receiver in group
     */
    const existing = await SettlementRequest.findOne({
      groupId,
      from: fromId,
      to: toId,
      status: "PENDING",
    });

    if (existing) {
      return res.status(409).json({
        message:
          "A settlement request is already pending between these users in this group.",
      });
    }

    const reqDoc = await SettlementRequest.create({
      groupId,
      from: fromId,
      to: toId,
      amount: Number(amount),
      createdBy: req.user._id,
      status: "PENDING",
    });

    // ✅ Create notification for receiver
    const notif = await Notification.create({
      userId: toId,
      groupId,
      type: "SETTLEMENT_REQUEST",
      title: "Settlement Request",
      message: `${req.user.username} requested confirmation for ₹${amount}`,
    });

    // ✅ SOCKET: notify receiver
    await emitNotificationToUser(toId, notif);

    // ✅ SOCKET: group event
    const io = getIO();
    io.to(groupId.toString()).emit("settlement_requested", {
      groupId: groupId.toString(),
      requestId: reqDoc._id,
      fromId,
      toId,
      amount: Number(amount),
    });

    return res
      .status(201)
      .json({ message: "Settlement request created", request: reqDoc });
  } catch (err) {
    console.error("requestSettlement error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.confirmSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { requestId, action } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId))
      return res.status(400).json({ message: "Invalid groupId" });

    if (!mongoose.Types.ObjectId.isValid(requestId))
      return res.status(400).json({ message: "Invalid requestId" });

    const reqDoc = await SettlementRequest.findById(requestId);
    if (!reqDoc) return res.status(404).json({ message: "Request not found" });

    // ✅ Only receiver can confirm/reject
    if (reqDoc.to.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Only receiver can confirm/reject." });
    }

    if (reqDoc.status !== "PENDING")
      return res.status(400).json({ message: "Request already processed." });

    const io = getIO();

    if (action === "CONFIRM") {
      reqDoc.status = "CONFIRMED";
      await reqDoc.save();

      // ✅ Ledger entry
      await LedgerEntry.create({
        groupId,
        type: "SETTLEMENT_COMPLETED",
        actor: req.user._id,
        data: {
          from: reqDoc.from,
          to: reqDoc.to,
          amount: reqDoc.amount,
        },
        status: "ACTIVE",
      });

      // ✅ Notify debtor
      const notif = await Notification.create({
        userId: reqDoc.from,
        groupId,
        type: "SETTLEMENT_CONFIRMED",
        title: "Settlement Confirmed",
        message: `${req.user.username} confirmed settlement ₹${reqDoc.amount}`,
      });

      await emitNotificationToUser(reqDoc.from, notif);

      io.to(groupId.toString()).emit("settlement_completed", {
        groupId: groupId.toString(),
        requestId,
        fromId: reqDoc.from.toString(),
        toId: reqDoc.to.toString(),
        amount: reqDoc.amount,
      });

      return res.status(200).json({ message: "Settlement confirmed" });
    }

    if (action === "REJECT") {
      reqDoc.status = "REJECTED";
      await reqDoc.save();

      // ✅ Notify debtor
      const notif = await Notification.create({
        userId: reqDoc.from,
        groupId,
        type: "SETTLEMENT_REJECTED",
        title: "Settlement Rejected",
        message: `${req.user.username} rejected settlement ₹${reqDoc.amount}`,
      });

      await emitNotificationToUser(reqDoc.from, notif);

      io.to(groupId.toString()).emit("settlement_rejected", {
        groupId: groupId.toString(),
        requestId,
        amount: reqDoc.amount,
      });

      return res.status(200).json({ message: "Settlement rejected" });
    }

    return res.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.error("confirmSettlement error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.remindSettlement = async (req, res) => {
  try {
    const { groupId } = req.params;

    // ✅ frontend sends only { toId, amount }
    const { toId, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId))
      return res.status(400).json({ message: "Invalid groupId" });

    if (!mongoose.Types.ObjectId.isValid(toId))
      return res.status(400).json({ message: "Invalid toId" });

    if (!amount || Number(amount) <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    /**
     * ✅ Remind is allowed only for receiver/creditor,
     * but backend cannot guess receiver from request body.
     * So enforce rule like this:
     * receiver must NOT remind themselves.
     */
    if (req.user._id.toString() === toId.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot remind yourself." });
    }

    const notif = await Notification.create({
      userId: toId, // ✅ debtor gets reminder
      groupId,
      type: "REMINDER",
      title: "Payment Reminder",
      message: `${req.user.username} reminded you to settle ₹${amount}`,
    });

    // ✅ socket to debtor only
    await emitNotificationToUser(toId, notif);

    // ✅ optional group event
    const io = getIO();
    io.to(groupId.toString()).emit("reminder_sent", {
      groupId: groupId.toString(),
      toId: toId.toString(),
      amount: Number(amount),
    });

    return res.status(200).json({ message: "Reminder sent" });
  } catch (err) {
    console.error("remindSettlement error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
