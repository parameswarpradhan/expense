const Group = require("../models/group");
const LedgerEntry = require("../models/LedgerEntry");

exports.getMyDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Find groups where user is a member
    const groups = await Group.find({ members: userId }).select("_id name");

    // 2️⃣ For each group, compute summary
    const dashboard = [];

    for (const group of groups) {
      const ledgerEntries = await LedgerEntry.find({
        groupId: group._id,
        $or: [
          { actor: userId },
          { "data.payer": userId },
          { "data.participants": userId }
        ]
      });

      let youGet = 0;
      let youOwe = 0;
      let totalExpense = 0;

      for (const entry of ledgerEntries) {
        if (entry.type === "EXPENSE_CREATED") {
          totalExpense += entry.data.amount;

          const splitAmount = entry.data.splits?.[userId];

          if (splitAmount !== undefined) {
            if (entry.data.payer.toString() === userId.toString()) {
              youGet += entry.data.amount - splitAmount;
            } else {
              youOwe += splitAmount;
            }
          }
        }

        if (entry.type === "SETTLEMENT_COMPLETED") {
          if (entry.data.from.toString() === userId.toString()) {
            youOwe -= entry.data.amount;
          }
          if (entry.data.to.toString() === userId.toString()) {
            youGet -= entry.data.amount;
          }
        }
      }

      dashboard.push({
        groupId: group._id,
        groupName: group.name,
        youGet,
        youOwe,
        totalExpense
      });
    }

    return res.status(200).json({ groups: dashboard });

  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
