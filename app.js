
console.log("🔥 THIS APP.JS IS RUNNING 🔥");



require("dotenv").config();
console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET);





// 1️⃣ Load environment variables FIRST
require("dotenv").config();

// 2️⃣ Basic imports
const express = require("express");
const app = express();

// 3️⃣ Database connection
require("./db");

// 4️⃣ Global middleware
require("./config")(app);

// 5️⃣ Routes
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const userTastesRoutes = require("./routes/user-tastes.routes");
app.use("/api/user-tastes", userTastesRoutes);

// 6️⃣ Error handling (LAST)
require("./error-handling")(app);

module.exports = app;
