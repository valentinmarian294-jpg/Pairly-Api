const router = require("express").Router();
const Message = require("../models/Message.model");
const Chat = require("../models/Chat.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/chats/:chatId/messages", isAuthenticated, async (req, res, next) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.post("/chats/:chatId/messages", isAuthenticated, async (req, res, next) => {
  try {
    const newMessage = await Message.create({
      chat: req.params.chatId,
      sender: req.payload._id,
      text: req.body.text,
    });

    const populatedMessage = await newMessage.populate("sender", "name");

    res.status(201).json(populatedMessage);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
