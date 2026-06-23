const User = require("../models/user");
const Provider = require("../models/provider");
const { generateOTP, hashOTP, compareOTP } = require("../Utils/otp");
const {
  setOtp,
  getOtp,
  deleteOtp,
  incrementOtpRequest,
  incrementOtpFail,
  clearOtpFail,
} = require("../Utils/otpstore");

const { generateAccessToken, generateRefreshToken } = require("../Utils/jwt");

const verifyProviderOtp = async (req, res) => {
  try {
    const { name, phone, otp } = req.body;

    // ================= VALIDATION =================

    if (!name?.trim() || !phone?.trim() || !otp?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and OTP are required",
      });
    }

    // ================= OTP VERIFICATION =================

    const storedOtp = await getOtp(phone);

    if (!storedOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
      });
    }

    const isValidOtp = await compareOTP(otp, storedOtp);

    if (!isValidOtp) {
      const failCount = await incrementOtpFail(phone);

      if (failCount >= 5) {
        await Promise.all([
          deleteOtp(phone),
          clearOtpFail(phone),
        ]);

        return res.status(429).json({
          success: false,
          message: "Too many incorrect OTP attempts. Please request a new OTP.",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // ================= CLEANUP OTP =================

    await Promise.all([
      deleteOtp(phone),
      clearOtpFail(phone),
    ]);

    // ================= USER UPSERT =================

    const user = await User.findOneAndUpdate(
      { phone },
      {
        $set: {
          name: name.trim(),
          phone,
          role: "provider",
          isVerified: true,
        },
      },
      {
        upsert: true,
        new: true,
        projection: { _id: 1 },
      }
    ).lean();

    // ================= PROVIDER UPSERT =================

    const provider = await Provider.findOneAndUpdate(
      { userId: user._id },
      {
        $setOnInsert: {
          userId: user._id,
        },
        $set: {
          name: name.trim(),
          isApproved: true,
          duty: true,
        },
      },
      {
        upsert: true,
        new: true,
        projection: {
          _id: 1,
          name: 1,
        },
      }
    ).lean();

    // ================= JWT PAYLOAD =================

    const tokenPayload = {
      providerId: provider._id,
      role: "provider",
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // ================= SAVE REFRESH TOKEN =================

    await Provider.updateOne(
      { _id: provider._id },
      {
        $set: {
          refreshToken,
        },
      }
    );

    // ================= COOKIE OPTIONS =================

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ================= RESPONSE =================

    return res.status(200).json({
      success: true,
      message: "Provider verified successfully",
      providerId: provider._id,
      accessToken,
    });

  } catch (error) {
    console.error("Verify Provider OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const addProvider = async (req, res) => {
  try {
    const { name, services, location } = req.body;

    if (!name || !services || !location) {
      return res.status(400).json({
        message: "Name, services and location are required",
      });
    }

    const providerDoc = await Provider.findOneAndUpdate(
      { name },
      {
        $set: {
          name,
          services,
          "location.coordinates": location.coordinates,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );

    return res.send("done");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getNearestProviders = async (req, res) => {
  try {
    const { lng, lat, page = 1, limit = 10 } = req.query;

    const longitude = Number(lng);
    const latitude = Number(lat);

    if (Number.isNaN(longitude) || Number.isNaN(latitude)) {
      return res.status(400).json({
        success: false,
        message: "Valid longitude and latitude are required",
      });
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const providers = await Provider.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "distanceInMeters",
          spherical: true,
          key: "location",
          maxDistance: 10000, // 10 KM
          query: {
            duty: true,
            isApproved: true,
          },
        },
      },

      {
        $lookup: {
          from: "services",
          let: {
            providerId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$providerId", "$$providerId"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                description: 1,
                images: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
          as: "services",
        },
      },

      // Remove providers without services
      {
        $match: {
          "services.0": { $exists: true },
        },
      },

      // One document per service
      {
        $unwind: "$services",
      },

      {
        $addFields: {
          distanceKm: {
            $round: [
              {
                $divide: ["$distanceInMeters", 1000],
              },
              1,
            ],
          },
        },
      },

      {
        $sort: {
          distanceInMeters: 1,
        },
      },

      {
        $project: {
          _id: 0,
          // Provider Details
          providerId: "$_id",
          providerName: "$name",
          location: "$Address", // change according to schema
          distanceKm: 1,
          duty: 1,
          userId:1,

          // Service Details
          serviceId: "$services._id",
          serviceName: "$services.name",
          description: "$services.description",
          images: {
            $ifNull: ["$services.images", []],
          },
          createdAt: "$services.createdAt",
          updatedAt: "$services.updatedAt",
        },
      },

      {
        $skip: skip,
      },

      {
        $limit: limitNum,
      },
    ]);

    return res.status(200).json({
      success: true,
      count: providers.length,
      pagination: {
        currentPage: pageNum,
        pageSize: limitNum,
        hasMore: providers.length === limitNum,
      },
      data: providers,
    });
  } catch (error) {
    console.error("getNearestProviders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch nearby services",
      error: error.message,
    });
  }
};

const getProviderDetails = async (req, res) => {
  try {
    const providerId = req.user?.id;
    if (!providerId) {
      return res.status(400).json({ message: "Provider ID missing" });
    }
    const provider = await Provider.findOne({ _id: providerId}).select(
      "-password -refreshToken -__v",
    );

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    return res.status(200).json({ success: true, data: provider });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching provider details",
      error: error.message,
    });
  }
};

module.exports = {
  verifyProviderOtp,
  addProvider,
  getNearestProviders,
  getProviderDetails,
}; 