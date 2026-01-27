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
// GET /api/users/profile
router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});


// GET /api/users/:id
router.get("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});
const UserTaste = require("../models/UserTaste.model");

/*
  GET /api/users/:id/tastes
*/
router.get("/:id/tastes", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.params.id;

    const tastes = await UserTaste.find({ user: userId })
      .populate("tasteItem");

    res.status(200).json(tastes);
  } catch (err) {
    next(err);
  }
});


// PUT /api/users/profile
router.put("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const { age, bio, image } = req.body;

    if (!age) {
      return res.status(400).json({ message: "Age is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { age, bio, image },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
