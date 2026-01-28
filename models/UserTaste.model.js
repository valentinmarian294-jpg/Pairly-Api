const mongoose = require('mongoose');

const userTasteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    tasteItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TasteItem",
      required: true
    },
    bio: {
      type: String,
      required: [true, "Bio is require."],
    },
  },
  {
    timestamps: true
  }
);





const UserTaste = mongoose.model("UserTaste", userTasteSchema);

module.exports = UserTaste;
