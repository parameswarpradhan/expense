const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  getMyNotifications,
  markAllRead,
} = require("../controllers/notificationController");

router.get("/notifications", auth, getMyNotifications);
router.post("/notifications/read-all", auth, markAllRead);

module.exports = router;
