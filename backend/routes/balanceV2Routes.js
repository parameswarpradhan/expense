const express = require("express");
const router = express.Router();
const { getGroupBalancesV2 } = require("../controllers/balanceV2Controller");

router.get("/groups/:groupId/balances", getGroupBalancesV2);

module.exports = router;
