const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireGroupMember = require("../middleware/requireGroupMember");
const { adjustExpense } = require("../controllers/expenseAdjustmentController");

router.put(
  "/groups/:groupId/expenses/:expenseId/adjust",
  auth,
  requireGroupMember,
  adjustExpense
);

module.exports = router;

