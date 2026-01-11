const express = require('express');
const app = express();
const router = express.Router();
const cors = require("cors");
const mongoose = require('mongoose');
const authenticate = require('./middleware/auth');
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
const userModel = require('./models/user');
const transactionModel = require("./models/transaction");
const path = require('path');
const ejs = require('ejs');
require("dotenv").config();
const { log } = require('console');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieparser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
const port = 8080;
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


app.get("/register", (req, res) => {
    res.render('register');
});


app.get("/", (req, res) => {
    res.render('home');
});

app.get("/login", (req, res) => {
    res.status(200).json('login');
});


app.get("/loggedin", authenticate, async (req, res) => {
    console.log(req.user);
    console.log(req.user.username);
    try {
        const user1 = await userModel.findOne({ email: req.user.email });
        console.log(user1.balance);
        res.render('loggedinDashboard', { user: req.user, balance: user1.balance });
    } catch (err) {
        console.log(err);
    }
});

app.get("/dashboards", authenticate, async (req, res) => {
    const users = await userModel.find({});
    console.log(users);
    res.render('dashboards', { users: users });
})


app.get("/entry", authenticate, async (req, res) => {
    const users = await userModel.find({});
    console.log(users);
    // res.render('createEntry', { users: users });
    res.json(users);
})



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
    const transactions = await transactionModel.find({ users: req.params.userId })
      .populate("users", "username email");
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});




app.post("/registerUser", (req, res) => {
    console.log('sending');
    console.log(req.body)
    let { username, email, password, balance } = req.body;
    try {
        let createduser = userModel.create({
            username,
            email,
            password,
            balance
        })
    } catch (err) {
        console.log(err);
        res.json(err);
    }
    console.log("sent");
    res.json("received")
});


app.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.json("Invalid email or password");
    }

    if (req.body.password !== user.password) {
      return res.json("Invalid email or password");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ "token": token,message: "logged in successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json("Internal Server Error");
  }
});



 

app.post("/entry", async (req, res) => {
    try {
        const { given: name, details, amount, divided: given } = req.body;

        if (!name) return res.status(400).json("Go back and first select who has given");
        if (!given) return res.status(400).json("Go back and check between whom it will be divided");

        console.log("✅ Entry received:", { name, details, amount, given });

        // Find contributor (giver)
        const contributer = await userModel.findOne({ username: name });
        if (!contributer) return res.status(404).json("Contributor not found");

        const prevBalance = contributer.balance;
        const newBalance = Number(prevBalance) - Number(amount);
        let involvedUserIds = [contributer._id]; // start with contributor's ObjectId

        // Case 1: Contributor is also among receivers
        if (given.includes(name)) {
            console.log("Contributor is also among consumers");

            if (Array.isArray(given)) {
                const eachAmount = Number(amount) / given.length;
                const netBalance = newBalance + eachAmount;

                // Update contributor’s new balance
                await userModel.findOneAndUpdate({ username: name }, { balance: netBalance });

                // Update all other consumers
                const consumers = await userModel.find({ username: { $in: given } });

                for (const consumer of consumers) {
                    if (consumer.username === name) continue; // skip contributor
                    const newBalanceConsumer = Number(consumer.balance) + Number(eachAmount);
                    await userModel.findOneAndUpdate({ username: consumer.username }, { balance: newBalanceConsumer });
                    involvedUserIds.push(consumer._id);
                }
            } else {
                // Only self involved
                await userModel.findOneAndUpdate({ username: name }, { balance: newBalance });
            }

        } 
        // Case 2: Contributor not among receivers
        else {
            console.log("Contributor is NOT among consumers");
            await userModel.findOneAndUpdate({ username: name }, { balance: newBalance });

            if (Array.isArray(given)) {
                const eachAmount = Number(amount) / given.length;
                const consumers = await userModel.find({ username: { $in: given } });

                for (const consumer of consumers) {
                    const newBalanceConsumer = Number(consumer.balance) + Number(eachAmount);
                    await userModel.findOneAndUpdate({ username: consumer.username }, { balance: newBalanceConsumer });
                    involvedUserIds.push(consumer._id);
                }
            } else {
                const singleConsumer = await userModel.findOne({ username: given });
                if (singleConsumer) {
                    const newBalanceConsumer = Number(singleConsumer.balance) + Number(amount);
                    await userModel.findOneAndUpdate({ username: given }, { balance: newBalanceConsumer });
                    involvedUserIds.push(singleConsumer._id);
                }
            }
        }

        await transactionModel.create({
            amount: Number(amount) / given.length,
            description: details,
            users: involvedUserIds
        });

        console.log("📜 Transaction saved with users:", involvedUserIds);
        return res.status(200).json("Changes applied and transaction recorded");

    } catch (err) {
        console.error("❌ Error in /entry:", err);
        return res.status(500).json("Internal Server Error");
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














const expenseV2Routes = require("./routes/expenseV2Routes");
app.use("/api/v2", expenseV2Routes);


// const balanceV2Routes = require("./routes/balanceV2Routes");
// app.use("/api/v2", balanceV2Routes);

// const expenseAdjustmentRoutes = require("./routes/groupExpenseAdjustRoutes");
// app.use("/api/v2", expenseAdjustmentRoutes);

const groupRoutes = require("./routes/groupRoutes");
app.use("/api/v2", groupRoutes);

const groupSettlementRoutes = require("./routes/groupSettlementRoutes");
app.use("/api/v2", groupSettlementRoutes);


// const groupInviteRoutes = require("./routes/groupInviteRoutes");
// app.use("/api/v2", groupInviteRoutes);

app.use("/api/v2/groups", require("./routes/groupInviteRoutes"));

const meRoutes = require("./routes/meRoutes");
app.use("/api/v2", meRoutes);

const groupExpenseRoutes = require("./routes/groupExpenseRoutes");
app.use("/api/v2", groupExpenseRoutes);

const groupBalanceRoutes = require("./routes/groupBalanceRoutes");
app.use("/api/v2", groupBalanceRoutes);

const groupLedgerRoutes = require("./routes/groupLedgerRoutes");
app.use("/api/v2", groupLedgerRoutes);

const groupExpenseAdjustRoutes = require("./routes/groupExpenseAdjustRoutes");
app.use("/api/v2", groupExpenseAdjustRoutes);

const meGroupsRoutes = require("./routes/meGroupsRoutes");
app.use("/api/v2", meGroupsRoutes);


const groupMembersRoutes = require("./routes/groupMembersRoutes");
app.use("/api/v2", groupMembersRoutes);

const groupExpenseListRoutes = require("./routes/groupExpenseListRoutes");
app.use("/api/v2", groupExpenseListRoutes);









app.listen(port, () => {
    console.log("working on", port);
})