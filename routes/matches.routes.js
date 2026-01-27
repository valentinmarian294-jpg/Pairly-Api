const router = require("express").Router();
const Match = require("../models/Match.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;

    const matches = await Match.find({
      users: userId,
    }).populate("users", "-password");

    const formatted = matches.map((match) => {
      const otherUser = match.users.find(
        (u) => u._id.toString() !== userId
      );

      return {
        _id: match._id,
        otherUser,
        createdAt: match.createdAt,
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
