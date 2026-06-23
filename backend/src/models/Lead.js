// /models/Lead.js
const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider"
  },
  type: {
    type: String,
    enum: ["call", "whatsapp"] 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Lead", leadSchema);