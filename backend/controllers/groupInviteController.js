const Group = require("../models/group");
const crypto = require("crypto");

// ✅ Generate invite
exports.generateInviteLink = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // ✅ only owner can generate invite (optional)
    // if (group.owner.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Only owner can invite" });
    // }

    // ✅ simple token
    const token = crypto.randomBytes(8).toString("hex");

    group.inviteToken = token;
    await group.save();

    return res.status(200).json({
      message: "Invite generated",
      inviteLink: `/join/${token}`,
      token,
    });
  } catch (err) {
    console.error("generateInviteLink error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Join by token
exports.joinGroupByInvite = async (req, res) => {
  try {
    const { token } = req.params;

    const group = await Group.findOne({ inviteToken: token });
    if (!group) return res.status(404).json({ message: "Invalid invite token" });

    const userId = req.user._id.toString();

    // ✅ already member
    if (group.members.some((m) => m.toString() === userId)) {
      return res.status(200).json({ message: "Already member", groupId: group._id });
    }

    group.members.push(userId);
    await group.save();

    return res.status(200).json({
      message: "Joined group successfully",
      groupId: group._id,
    });
  } catch (err) {
    console.error("joinGroupByInvite error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
