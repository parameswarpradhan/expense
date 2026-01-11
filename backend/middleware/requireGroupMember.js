const Group = require("../models/group");

module.exports = async function requireGroupMember(req, res, next) {
  try {
    const { groupId } = req.params;
    const userId = req.user._id.toString();

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((m) => m.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ message: "Access denied: not a group member" });
    }

    req.group = group; // attach group for next handlers
    next();
  } catch (err) {
    console.error("requireGroupMember error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
