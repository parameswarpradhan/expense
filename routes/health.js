const router = require("express").Router();
const mongoose = require("mongoose");

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "Backend running fine" });
});

router.get("/health/db", async (req, res) => {
  try {
    const state = mongoose.connection.readyState; 
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

    res.json({
      ok: true,
      dbReadyState: state,
      connected: state === 1,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});
});
router.get("/health/env", (req, res) => {
  res.json({
    ok: true,
    hasMongo: !!process.env.MONGO_URI,
    hasJwt: !!process.env.JWT_SECRET,
    clientUrl: process.env.CLIENT_URL
  });

module.exports = router;
