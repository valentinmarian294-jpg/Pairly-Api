
console.log("APP RECEIVED A REQUEST");

require("dotenv").config();
console.log("TOKEN_SECRET:", process.env.TOKEN_SECRET);

require("dotenv").config();

const express = require("express");
const app = express();

require("./db");

require("./config")(app);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const tasteItemsRoutes = require("./routes/taste-items.routes");
app.use("/api/taste-items", tasteItemsRoutes);


const userTastesRoutes = require("./routes/user-tastes.routes");
app.use("/api/user-tastes", userTastesRoutes);

const usersRoutes = require("./routes/users.routes");
app.use("/api/users", usersRoutes);

const userLikesRoutes = require("./routes/user-likes.routes");
app.use("/api/user-likes", userLikesRoutes);

const matchesRoutes = require("./routes/matches.routes");
app.use("/api/matches", matchesRoutes);


require("./error-handling")(app);
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Invalid or missing token" });
  }
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
