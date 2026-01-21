const router = require("express").Router();
const UserTaste = require("../models/UserTaste.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");


router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const { tasteItemId } = req.body;

    if (!tasteItemId) {
      return res.status(400).json({ message: "tasteItemId is required" });
    }

    const existingUserTaste = await UserTaste.findOne({
      user: userId,
      tasteItem: tasteItemId
    });

    if (existingUserTaste) {
      return res.status(409).json({ message: "Taste already selected" });
    }

    const newUserTaste = await UserTaste.create({
      user: userId,
      tasteItem: tasteItemId
    });

    res.status(201).json(newUserTaste);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
