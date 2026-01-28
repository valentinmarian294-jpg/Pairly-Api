const router = require("express").Router();
const User = require("../models/User.model");
const UserTaste = require("../models/UserTaste.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

/* ======================================================
   GET /api/users/discover
====================================================== */
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

/* ======================================================
   GET /api/users/profile   ✅ CURRENT USER (FIXED)
====================================================== */
router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;

    console.log("==== PROFILE FETCH HIT ====");
    console.log("User ID from token:", userId);

    const user = await User.findById(userId).select("-password");

    console.log("User fetched from Mongo:", user);

    res.status(200).json(user);
  } catch (err) {
    console.error("PROFILE FETCH ERROR:", err);
    next(err);
  }
});

/* ======================================================
   PUT /api/users/profile   ✅ UPDATE PROFILE (FIXED)
====================================================== */
router.put("/profile", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;

    console.log("==== PROFILE UPDATE HIT ====");
    console.log("User ID from token:", userId);
    console.log("Incoming body:", req.body);

    const { name, age, bio, image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name !== undefined && { name }),
        ...(age !== undefined && { age }),
        ...(bio !== undefined && { bio }),
        ...(image !== undefined && { image }),
      },
      { new: true, runValidators: true }
    ).select("-password");

    console.log("UPDATED USER FROM MONGO:", updatedUser);

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    next(err);
  }
});

/* ======================================================
   GET /api/users/:id/tastes
====================================================== */
router.get("/:id/tastes", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.params.id;

    const tastes = await UserTaste.find({ user: userId }).populate("tasteItem");

    res.status(200).json(tastes);
  } catch (err) {
    next(err);
  }
});

/* ======================================================
   GET /api/users/:id   ⚠️ MUST BE LAST
====================================================== */
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

module.exports = router;
