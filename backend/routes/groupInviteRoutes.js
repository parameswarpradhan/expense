const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  generateInviteLink,
  joinGroupByInvite,
} = require("../controllers/groupInviteController");

router.post("/groups/:groupId/invite", auth, generateInviteLink);
router.post("/groups/join/:token", auth, joinGroupByInvite);

module.exports = router;
