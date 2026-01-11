const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authenticate = require("./middleware/auth");
const jwt = require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const userModel = require("./models/user");
const transactionModel = require("./models/transaction");
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();

// ✅ socket setup
const http = require("http");
const { initSocket } = require("./socket");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieparser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
const PORT = process.env.PORT || 8080;


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
connectDB();

// ------------------ NORMAL ROUTES ------------------ //
app.get("/register", (req, res) => res.render("register"));
app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.status(200).json("login"));

app.get("/loggedin", authenticate, async (req, res) => {
  try {
    const user1 = await userModel.findOne({ email: req.user.email });
    res.render("loggedinDashboard", { user: req.user, balance: user1.balance });
  } catch (err) {
    console.log(err);
  }
});

app.get("/dashboards", authenticate, async (req, res) => {
  const users = await userModel.find({});
  res.render("dashboards", { users });
});

app.get("/entry", authenticate, async (req, res) => {
  const users = await userModel.find({});
  res.json(users);
});

app.get("/me", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ loggedIn: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ loggedIn: false });
  }
});

app.get("/api/user/:id", async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.get("/api/transactions/:userId", async (req, res) => {
  try {
    const transactions = await transactionModel
      .find({ users: req.params.userId })
      .populate("users", "username email");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});





app.post("/registerUser", async (req, res) => {
  try {
    const { username, email, password, balance } = req.body;
    await userModel.create({ username, email, password, balance });
    res.json("received");
  } catch (err) {
    console.log(err);
    res.status(500).json("Register failed");
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) return res.json("Invalid email or password");

    if (req.body.password !== user.password)
      return res.json("Invalid email or password");

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ token, message: "logged in successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json("Internal Server Error");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
  });
  return res.status(200).json({ message: "Logged out successfully." });
});
const notificationRoutes = require("./routes/notificationRoutes");
app.use("/api/v2", notificationRoutes);


// ------------------ GROUP V2 ROUTES ------------------ //
app.use("/api/v2", require("./routes/expenseV2Routes"));
app.use("/api/v2", require("./routes/groupRoutes"));
app.use("/api/v2", require("./routes/groupSettlementRoutes"));
app.use("/api/v2", require("./routes/groupInviteRoutes"));
app.use("/api/v2", require("./routes/health"));

app.use("/api/v2", require("./routes/meRoutes"));
app.use("/api/v2", require("./routes/groupExpenseRoutes"));
app.use("/api/v2", require("./routes/groupBalanceRoutes"));
app.use("/api/v2", require("./routes/groupLedgerRoutes"));
app.use("/api/v2", require("./routes/groupExpenseAdjustRoutes"));
app.use("/api/v2", require("./routes/meGroupsRoutes"));
app.use("/api/v2", require("./routes/groupMembersRoutes"));
app.use("/api/v2", require("./routes/groupExpenseListRoutes"));

// ✅ create server + init socket
const server = http.createServer(app);
initSocket(server);



// ✅ START SERVER
server.listen(PORT, () => {
  console.log("✅ working on", PORT);
});
