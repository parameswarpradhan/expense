const express = require("express");
const router = express.Router();
const { createExpenseV2 } = require("../controllers/expenseV2Controller");

router.post("/expenses", createExpenseV2);

module.exports = router;
