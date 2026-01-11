const Group = require("../models/group");

exports.getMyGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId })
      .select("_id name members owner createdAt");

    return res.status(200).json({ groups });
  } catch (err) {
    console.error("Get my groups error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
