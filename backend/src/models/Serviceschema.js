const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 2,
      maxlength: 80,
      index: true,
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "provider",
      required: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    images: {
      type: [
        {
          url: {
            type: String,
          },

          publicId: {
            type: String,
          },
        },
      ],
      default: [],
    },
    experience: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// TEXT SEARCH INDEX
ServiceSchema.index({
  name: "text",
  description: "text",
});

// Prevent duplicate services
ServiceSchema.index({ providerId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Service", ServiceSchema);
