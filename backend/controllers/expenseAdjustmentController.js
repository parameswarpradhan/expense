const mongoose = require("mongoose");
const Expense = require("../models/transaction");
const LedgerEntry = require("../models/LedgerEntry");

exports.adjustExpense = async (req, res) => {
  try {
    const expenseId = req.params.expenseId || req.body.expenseId;

    const { payer, splits } = req.body;

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ message: "Invalid expenseId" });
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const totalAmount = Object.values(splits).reduce((a, b) => a + b, 0);

    // 1️⃣ Ledger entry to negate old expense
    await LedgerEntry.create({
      groupId: expense.groupId,
      type: "EXPENSE_ADJUSTED",
      actor: payer,
      data: {
        referenceId: expense._id,
        splits: expense.splits,
        amount: expense.amount
      }
    });

    // 2️⃣ Ledger entry for new corrected expense
    await LedgerEntry.create({
      groupId: expense.groupId,
      type: "EXPENSE_CREATED",
      actor: payer,
      data: {
        payer,
        participants: Object.keys(splits),
        splits,
        amount: totalAmount,
        referenceId: expense._id
      }
    });

    // 3️⃣ Update expense metadata ONLY
    expense.splits = splits;
    expense.amount = totalAmount;
    expense.state = "MODIFIED";
    await expense.save();

    return res.status(200).json({ message: "Expense adjusted successfully" });

  } catch (error) {
    console.error("Adjust expense error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.reverseExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ message: "Invalid expenseId" });
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await LedgerEntry.create({
      groupId: expense.groupId,
      type: "EXPENSE_REVERSED",
      actor: expense.paidBy,
      data: {
        referenceId: expense._id,
        splits: expense.splits,
        amount: expense.amount
      }
    });

    expense.state = "ARCHIVED";
    await expense.save();

    return res.status(200).json({ message: "Expense reversed successfully" });

  } catch (error) {
    console.error("Reverse expense error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
