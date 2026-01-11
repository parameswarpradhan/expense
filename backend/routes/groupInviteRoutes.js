const express = require("express");
const router = express.Router();
const {
  createInviteLink,
  joinGroupViaInvite
} = require("../controllers/groupInviteController");
const auth = require("../middleware/auth");

// REMOVE "groups" FROM HERE
router.post("/:groupId/invite", auth, createInviteLink);
router.post("/join/:token", auth, joinGroupViaInvite);

module.exports = router;
