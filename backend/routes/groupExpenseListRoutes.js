const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireGroupMember = require("../middleware/requireGroupMember");
const { getGroupExpenses } = require("../controllers/groupExpenseListController");

router.get("/groups/:groupId/expenses", auth, requireGroupMember, getGroupExpenses);

module.exports = router;
