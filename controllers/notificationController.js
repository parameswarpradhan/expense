const Notification = require("../models/Notification");

const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return res.status(200).json({ notifications, unreadCount });
  } catch (err) {
    console.error("getMyNotifications error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const markAllRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );

    return res.status(200).json({ message: "All notifications marked read" });
  } catch (err) {
    console.error("markAllRead error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getMyNotifications, markAllRead };
