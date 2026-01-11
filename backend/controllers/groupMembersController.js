const Group = require("../models/group");
const User = require("../models/user");

exports.getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate("members", "username email");
    if (!group) return res.status(404).json({ message: "Group not found" });

    return res.status(200).json({
      members: group.members
    });
  } catch (err) {
    console.error("Get group members error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
