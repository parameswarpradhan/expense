const Group = require("../models/group");

exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    const ownerId = req.user._id;
    const incomingMembers = Array.isArray(members) ? members : [];

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

    if (!group) return res.status(404).json({ message: "Group not found" });

    // ✅ send clean structured response
    return res.status(200).json({
      _id: group._id,
      name: group.name,
      owner: group.owner,
      members: group.members
    });
  } catch (error) {
    console.error("Get group details error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
