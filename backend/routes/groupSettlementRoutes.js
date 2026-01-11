const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireGroupMember = require("../middleware/requireGroupMember");
const { getSettlements } = require("../controllers/settlementController");

const {
  requestSettlement,
  confirmSettlement,
  remindSettlement,
} = require("../controllers/settlement2WayController");

router.get("/groups/:groupId/settlements", auth, requireGroupMember, getSettlements);

router.post("/groups/:groupId/settlements/request", auth, requireGroupMember, requestSettlement);
router.post("/groups/:groupId/settlements/confirm", auth, requireGroupMember, confirmSettlement);
router.post("/groups/:groupId/settlements/remind", auth, requireGroupMember, remindSettlement);

module.exports = router;
