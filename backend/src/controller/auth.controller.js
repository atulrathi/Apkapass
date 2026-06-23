const User = require("../models/User");
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

const normalizePhone = (phone) => {
  if (!phone) return null;

  // remove spaces, dashes, etc.
  phone = phone.replace(/\D/g, "");

  if (phone.length === 12 && phone.startsWith("91")) {
    phone = phone.slice(2);
  }

  return phone;
};

const isValidPhone = (phone) => /^\d{10}$/.test(phone);

// 🔹 SEND OTP
exports.sendOtp = async (req, res) => {
  try {
    let { phone } = req.body;
    const ip = req.ip;

    phone = normalizePhone(phone);

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    // Rate limiting
    const { phoneCount, ipCount } = await incrementOtpRequest(phone, ip);

    if (phoneCount > 3 || ipCount > 10) {
      return res.status(429).json({
        message: "Too many OTP requests. Try again later.",
      });
    }

    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);

    // should be atomic (SET NX EX)
    const isSet = await setOtp(phone, hashedOtp);

    if (!isSet) {
      return res.status(429).json({
        message: "OTP already sent. Please wait.",
      });
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("OTP:", otp);
    }

    return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 🔹 VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    let { phone, otp } = req.body;

    phone = normalizePhone(phone);

    // 🔹 Basic validation
    if (!isValidPhone(phone) || !otp) {
      return res.status(400).json({
        message: "Phone and valid OTP required",
      });
    }

    // 🔹 Get OTP from Redis
    const storedOtp = await getOtp(phone);

    if (!storedOtp) {
      return res.status(400).json({
        message: "OTP expired or not found",
      });
    }

    // 🔹 Verify OTP
    const isValid = await compareOTP(otp, storedOtp);

    // ❌ Invalid OTP
    if (!isValid) {
      const failCount = await incrementOtpFail(phone);

      if (failCount >= 5) {
        await Promise.all([
          deleteOtp(phone),
          clearOtpFail(phone),
        ]);

        return res.status(429).json({
          message: "Too many incorrect attempts. Request new OTP.",
        });
      }

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // ✅ OTP correct
    await Promise.all([
      deleteOtp(phone),
      clearOtpFail(phone),
    ]);

    // 🔹 Create user only if not exists
    let user = await User.findOneAndUpdate(
      { phone },
      {
        $setOnInsert: {
          phone,
          isVerified: true,
        },
      },
      {
        upsert: true,
        new: true,
        lean: true,
        projection: {
          _id: 1,
          phone: 1,
          role: 1,
        },
      }
    );

    let provider = null;
    let payloadId = user._id; // Default JWT ID = User ID
    let role = user.role || "user";

    // 🔹 If user is provider, fetch provider and use provider ID in JWT
    if (user.role === "provider") {
      provider = await Provider.findOne(
        { userId: user._id },
        {
          _id: 1,
          userId: 1,
          service: 1,
          location: 1,
          isApproved: 1,
        }
      ).lean();

      if (provider) {
        payloadId = provider._id; // Provider ID in JWT
        role = "provider";
      }
    }

    // 🔹 Generate tokens
    const payload = {
      id: payloadId,
      role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // 🔹 Update refresh token
    if (role === "provider" && provider) {
      await Provider.updateOne(
        { _id: provider._id },
        {
          $set: {
            refreshToken,
            isApproved: true,
          },
        }
      );
    } else {
      await User.updateOne(
        { _id: user._id },
        {
          $set: {
            refreshToken,
            isVerified: true,
          },
        }
      );
    }

    // 🔹 Set auth cookies
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      data: provider || user,
      role,
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 min
  });
};
