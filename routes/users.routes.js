const router = require("express").Router();
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// GET /api/users/discover
router.get("/discover", isAuthenticated, async (req, res, next) => {
  try {
    const currentUserId = req.payload._id;

    const users = await User.find(
      { _id: { $ne: currentUserId } },
      { password: 0 }
    );

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
