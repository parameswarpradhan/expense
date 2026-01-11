const Group = require("../models/group");

// const Group = require("../models/group");

exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    // ✅ Only name is mandatory
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    // ✅ owner comes from JWT
    const ownerId = req.user._id;

    // ✅ members can be empty (invite-based UX)
    const incomingMembers = Array.isArray(members) ? members : [];

    // ✅ ensure owner always included + no duplicates
    const uniqueMembers = Array.from(
      new Set([ownerId.toString(), ...incomingMembers.map(String)])
    );

    const group = await Group.create({
      name: name.trim(),
      owner: ownerId,
      members: uniqueMembers,
    });

    return res.status(201).json({
      message: "Group created",
      groupId: group._id,
    });
  } catch (error) {
    console.error("Create group error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("owner", "username email")
      .populate("members", "username email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(200).json(group);
  } catch (error) {
    console.error("Get group details error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

