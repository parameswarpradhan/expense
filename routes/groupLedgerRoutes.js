const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireGroupMember = require("../middleware/requireGroupMember");
const { getGroupLedger } = require("../controllers/ledgerController");

router.get("/groups/:groupId/ledger", auth, requireGroupMember, getGroupLedger);

module.exports = router;
