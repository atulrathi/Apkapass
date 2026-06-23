// /models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  role: {
    type: String,
    enum: ["user", "provider", "admin"],
    default: "user"
  },
  isVerified: {
    type: Boolean,
    default: false
  },

  refreshToken: { type: String },
  
  name: { type: String },
  email: { type: String },
  address: { type: String },
  profilePic: { type: String }
}, {
  timestamps: true
});

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);