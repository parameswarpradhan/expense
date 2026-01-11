const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { createExpenseV2 } = require("../controllers/expenseV2Controller");

// group-scoped expense creation
router.post("/groups/:groupId/expenses", auth, createExpenseV2);

module.exports = router;
