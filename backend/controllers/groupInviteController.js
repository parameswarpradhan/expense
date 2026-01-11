const crypto = require("crypto");
const Group = require("../models/group");

function generateToken() {
  return crypto.randomBytes(16).toString("hex"); // 32 chars
}

// ✅ Owner generates invite link
exports.createInviteLink = async (req, res) => {
  try {
    const { groupId } = req.params;

    // ✅ SAFELY GET USER ID
    const userId =
      req.user?._id?.toString() ||
      req.user?.id?.toString() ||
      req.userId?.toString();

    if (!userId) {
      return res.status(401).json({ message: "Invalid auth user" });
    }

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.owner) {
      return res.status(400).json({ message: "Group owner not set" });
    }

    if (group.owner.toString() !== userId) {
      return res.status(403).json({ message: "Only owner can generate invite link" });
    }

    if (!group.inviteToken) {
      group.inviteToken = generateToken();
      await group.save();
    }

    return res.status(200).json({
      inviteLink: `/join/${group.inviteToken}`,
      token: group.inviteToken
    });

  } catch (err) {
    console.error("Invite link error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// ✅ User joins group using invite token
exports.joinGroupViaInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = req.user._id;

    const group = await Group.findOne({ inviteToken: token, inviteEnabled: true });
    if (!group) return res.status(404).json({ message: "Invalid or expired invite link" });

    const alreadyMember = group.members.some(m => m.toString() === userId);
    if (alreadyMember) {
      return res.status(200).json({ message: "Already a member", groupId: group._id });
    }

    group.members.push(userId);
    await group.save();

    return res.status(200).json({ message: "Joined group successfully", groupId: group._id });
  } catch (err) {
    console.error("Join group error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
