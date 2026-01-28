const router = require("express").Router();
const TasteItem = require("../models/TasteItem.model");

router.get("/", async (req, res, next) => {
  try {
    const items = await TasteItem.find();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
