const router = require("express").Router();
const UserTaste = require("../models/UserTaste.model");
require("../models/TasteItem.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");




router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const mongoose = require("mongoose");

    const userId = req.payload._id;
    const { tasteItemId } = req.body;

    // 1️⃣ Required field check
    if (!tasteItemId) {
      return res.status(400).json({ message: "tasteItemId is required" });
    }

    // 2️⃣ ObjectId validation (MUST COME BEFORE ANY QUERY)
    if (!mongoose.Types.ObjectId.isValid(tasteItemId)) {
      return res.status(400).json({ message: "Invalid tasteItemId" });
    }

    // 3️⃣ Duplicate prevention
    const existingUserTaste = await UserTaste.findOne({
      user: userId,
      tasteItem: tasteItemId,
    });

    if (existingUserTaste) {
      return res.status(409).json({ message: "Taste already selected" });
    }

    // 4️⃣ Create link
    const newUserTaste = await UserTaste.create({
      user: userId,
      tasteItem: tasteItemId,
    });

    res.status(201).json(newUserTaste);
  } catch (error) {
    next(error);
  }
});


router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;

    const userTastes = await UserTaste.find({ user: userId })
      .populate("tasteItem");

    res.status(200).json(userTastes);
  } catch (error) {
    next(error);
  }
});

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload._id)
      .select("-password")
      .populate("tastes");

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const userTasteId = req.params.id;

    const deleted = await UserTaste.findOneAndDelete({
      _id: userTasteId,
      user: userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Taste not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});


module.exports = router;
