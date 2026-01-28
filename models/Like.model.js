const mongoose = require("mongoose");
const { Schema } = mongoose;

const likeSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "user", required: true },
    to: { type: Schema.Types.ObjectId, ref: "user", required: true },
  },
  { timestamps: true }
);

likeSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model("Like", likeSchema);