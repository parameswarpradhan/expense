const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireGroupMember = require("../middleware/requireGroupMember");
const { getGroupBalancesV2 } = require("../controllers/balanceV2Controller");

router.get("/groups/:groupId/balances", auth, requireGroupMember, getGroupBalancesV2);

module.exports = router;
