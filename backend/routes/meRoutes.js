const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getMyDashboard } = require("../controllers/meController");

router.get("/me/dashboard", auth, getMyDashboard);

module.exports = router;
