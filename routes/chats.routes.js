const router = require("express").Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const Chat = require("../models/Chat.model");

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const myId = req.payload._id;

    const chats = await Chat.find({ participants: myId })
      .sort({ lastMessageAt: -1 });

    res.status(200).json(chats);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
