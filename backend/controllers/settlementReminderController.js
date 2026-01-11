const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const { getIO } = require("../socket");
const Group = require("../models/group");

exports.sendReminder = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { toId, amount } = req.body;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid groupId" });
    }
    if (!mongoose.Types.ObjectId.isValid(toId)) {
      return res.status(400).json({ message: "Invalid toId" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const title = "Payment Reminder";
    const message = `${req.user.username} reminded you to settle ₹${amount} in group ${group.name}`;

    // ✅ save notification
    const notif = await Notification.create({
      userId: toId,
      groupId,
      type: "REMINDER",
      title,
      message,
    });

    // ✅ emit to user room
    const io = getIO();
    io.to(toId.toString()).emit("notification", {
      _id: notif._id,
      groupId: groupId.toString(),
      type: notif.type,
      title: notif.title,
      message: notif.message,
      isRead: notif.isRead,
      createdAt: notif.createdAt,
    });

    return res.status(201).json({ message: "Reminder sent ✅" });
  } catch (err) {
    console.error("sendReminder error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
