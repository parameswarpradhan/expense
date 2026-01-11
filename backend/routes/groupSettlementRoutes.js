const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireGroupMember = require("../middleware/requireGroupMember");
const { getSettlements } = require("../controllers/settlementController");
const { markPaid } = require("../controllers/groupSettlementMarkController");
// const auth = require("../middleware/auth");


router.get("/groups/:groupId/settlements", auth, requireGroupMember, getSettlements);
router.post(
  "/groups/:groupId/settlements/mark-paid",
  auth,
  requireGroupMember,
  markPaid
);


module.exports = router;
