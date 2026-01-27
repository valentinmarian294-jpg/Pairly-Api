const router = require("express").Router();
const Match = require("../models/Match.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    const currentUserId = req.payload._id.toString();

    const matches = await Match.find({
      users: currentUserId,
    }).populate("users", "-password");

    const formattedMatches = matches.map((match) => {
      const otherUser = match.users.find(
        (u) => u._id.toString() !== currentUserId
      );

      return {
        _id: match._id,
        otherUser,
        createdAt: match.createdAt,
      };
    });

    res.status(200).json(formattedMatches);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
