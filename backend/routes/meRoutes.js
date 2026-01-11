const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getMyDashboard } = require("../controllers/meController");
const User = require("../models/user");


router.get("/me/dashboard", auth, getMyDashboard);

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("_id username email");
    return res.status(200).json({ user });
  } catch (err) {
    console.error("GET /me error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});
module.exports = router;
