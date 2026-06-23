const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true 
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  Address:{
    type: String,
  },
  AdharcardImage:{
    type: String,
  },
  PancardImage:{
    type: String,
  },
  services: [{
    type: String,
    required: true,
    index: true 
  }],
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number],
      default: [77.0178, 28.9931]
    },
    address: {
      type: String,
    }
  },
  isApproved: {
    type: Boolean,
    default: false,
    index: true 
  },
  duty: {
    type: Boolean,
    required: true,
    index: true
  },
  isVerified: {
    type: Boolean,
    default: false,
    index: true 
  },
  rating: {
    type: Number,
    default: 0,
    index: true 
  },
  refreshToken: { 
    type: String,
    select: false 
  }
}, {
  timestamps: true
});
providerSchema.index({ isApproved: 1, location: "2dsphere" });

module.exports = mongoose.model("Provider", providerSchema);