const mongoose = require('mongoose');

const tasteItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ["movie", "show", "game", "music"]
    }
  },
  {
    timestamps: true
  }
);

const TasteItem = mongoose.model("TasteItem", tasteItemSchema);

module.exports = TasteItem;
