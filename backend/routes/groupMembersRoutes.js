const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const requireGroupMember = require("../middleware/requireGroupMember");
const { getGroupMembers } = require("../controllers/groupMembersController");

router.get("/groups/:groupId/members", auth, requireGroupMember, getGroupMembers);

module.exports = router;
