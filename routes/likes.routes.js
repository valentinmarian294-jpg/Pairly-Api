const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Like = require("../models/Like.model");
const Chat = require("../models/Chat.model");

router.get("/received", isAuthenticated, async (req, res, next) => {
  try {
    const myId = req.payload._id;

    const likes = await Like.find({ to: myId })
      .populate("from", "-password")
      .sort({ createdAt: -1 });

    const users = likes.map((l) => l.from);
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.post("/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const myId = req.payload._id;
    const otherId = req.params.userId;

    if (String(myId) === String(otherId)) {
      return res.status(400).json({ message: "You cannot like yourself." });
    }

    await Like.create({ from: myId, to: otherId }).catch(() => null);

    const isMatch = await Like.exists({ from: otherId, to: myId });

    if (isMatch) {
      const existingChat = await Chat.findOne({
        participants: { $all: [myId, otherId] },
      });

      if (!existingChat) {
        await Chat.create({ participants: [myId, otherId] });
      }

      return res.status(201).json({ match: true });
    }

    res.status(201).json({ match: false });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
