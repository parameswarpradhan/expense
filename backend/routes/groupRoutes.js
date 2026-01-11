const express = require("express");
const router = express.Router();
const { createGroup , getGroupDetails} = require("../controllers/groupController");
const auth = require("../middleware/auth"); // adjust name/path

router.post("/groups", auth, createGroup);
router.get("/groups/:groupId", auth, getGroupDetails);


module.exports = router;
