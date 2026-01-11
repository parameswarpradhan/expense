const mongoose = require("mongoose");

const Expense = require("../models/transaction");
const LedgerEntry = require("../models/LedgerEntry");
const Group = require("../models/group");

exports.createExpenseV2 = async (req, res) => {
    try {
        const groupId = req.params.groupId || req.body.groupId;
        const { title, payer, splits } = req.body;


        // -------- VALIDATION (DO NOT SKIP) --------
        if (!groupId || !title || !payer || !splits) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        // -------- OBJECT ID VALIDATION --------
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: "Invalid groupId" });
        }

        const group = await Group.findById(groupId);
if (!group) {
  return res.status(404).json({ message: "Group not found" });
}

const userId = req.user._id.toString();

// requester must be group member
if (!group.members.some(m => m.toString() === userId)) {
  return res.status(403).json({ message: "You are not a member of this group" });
}

// payer must be member
if (!group.members.some(m => m.toString() === payer)) {
  return res.status(400).json({ message: "Payer must be a group member" });
}

// all participants must be members
const participantIds = Object.keys(splits);
for (const pid of participantIds) {
  if (!group.members.some(m => m.toString() === pid)) {
    return res.status(400).json({ message: `Invalid participant: ${pid}` });
  }
}


        if (!mongoose.Types.ObjectId.isValid(payer)) {
            return res.status(400).json({ message: "Invalid payer userId" });
        }

        for (const userId of Object.keys(splits)) {
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).json({ message: "Invalid userId in splits" });
            }
        }


        const amounts = Object.values(splits);
        const totalAmount = amounts.reduce((a, b) => a + b, 0);

        if (totalAmount <= 0) {
            return res.status(400).json({ message: "Invalid split amount" });
        }

        // -------- STEP 1: CREATE EXPENSE (OLD SYSTEM) --------
        const expense = await Expense.create({
            groupId,
            title,
            amount: totalAmount,
            paidBy: payer,
            splits
        });

        // -------- STEP 2: CREATE LEDGER ENTRY (NEW SYSTEM) --------
        try {
            await LedgerEntry.create({
                groupId,
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
        } catch (err) {
            // Duplicate key error (idempotency)
            if (err.code !== 11000) throw err;
        }

        // -------- RESPONSE --------
        return res.status(201).json({
            message: "Expense created (v2)",
            expenseId: expense._id
        });

    } catch (error) {
        console.error("Expense v2 error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
