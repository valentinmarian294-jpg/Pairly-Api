const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

// GET /api/users/me
router.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id; // viene del token
    const user = await User.findById(userId).select("-password");

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
