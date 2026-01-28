const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },

  age: {
    type: Number,
    min: 18,
    max: 120
  },

  bio: {
    type: String,
    maxlength: 300
  },

  image: {
    type: String
  }
}, { timestamps: true });


const User = model("User", userSchema);

module.exports = User;
