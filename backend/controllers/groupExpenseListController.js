const Expense = require("../models/transaction");

exports.getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await Expense.find({ groupId })
      .sort({ createdAt: -1 });

    return res.status(200).json({ expenses });
  } catch (err) {
    console.error("Get group expenses error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
