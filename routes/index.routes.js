const express = require("express");
const router = express.Router();
const TasteItem = require("../models/TasteItem.model");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.get("/taste-items", async (req, res, next) => {
  try {
    const items = await TasteItem.find();
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
