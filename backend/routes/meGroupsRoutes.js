const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { getMyGroups } = require("../controllers/meGroupsController");

router.get("/me/groups", auth, getMyGroups);

module.exports = router;
