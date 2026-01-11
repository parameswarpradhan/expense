const LedgerEntry = require("../models/LedgerEntry");

exports.getGroupLedger = async (req, res) => {
  try {
    const { groupId } = req.params;

    const entries = await LedgerEntry.find({ groupId })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({ entries });
  } catch (err) {
    console.error("Ledger fetch error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
