const router = require("express").Router();
const UserLike = require("../models/UserLike.model");
const Match = require("../models/Match.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/sent/me", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;

    const likes = await UserLike.find({ fromUser: userId })
      .select("toUser");

    res.status(200).json(likes);
  } catch (err) {
    next(err);
  }
});

router.get("/received/me", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;

    const likes = await UserLike.find({ toUser: userId })
      .select("fromUser");

    res.status(200).json(likes);
  } catch (err) {
    next(err);
  }
});

router.post("/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const fromUser = req.payload._id;
    const toUser = req.params.userId;

    if (fromUser === toUser) {
      return res.status(400).json({ message: "Cannot like yourself" });
    }

    const existing = await UserLike.findOne({ fromUser, toUser });
    if (existing) {
      return res.status(409).json({ message: "Already liked" });
    }

    const like = await UserLike.create({ fromUser, toUser });

const reverseLike = await UserLike.findOne({
  fromUser: toUser,
  toUser: fromUser,
});

if (reverseLike) {
  const match = await Match.create({
    users: [fromUser, toUser],
  });

  await UserLike.deleteMany({
    $or: [
      { fromUser, toUser },
      { fromUser: toUser, toUser: fromUser },
    ],
  });

  return res.status(201).json({
    match: true,
    users: [fromUser, toUser],
  });
}

res.status(201).json({
  match: false,
  like,
});

  } catch (err) {
    next(err);
  }
});

router.delete("/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const fromUser = req.payload._id;
    const toUser = req.params.userId;

    await UserLike.findOneAndDelete({ fromUser, toUser });

    await Match.findOneAndDelete({
      users: { $all: [fromUser, toUser] },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});


module.exports = router;
