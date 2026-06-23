const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Provider = require("../models/provider");
const { generateAccessToken, generateRefreshToken } = require("../Utils/jwt");

async function refreshToken(req, res) {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id;

    let account = await User.findOne({ _id: userId },{ refreshToken: token });

    if (!account) {
      account = await Provider.findOne({  _id: userId },{ refreshToken: token });
    }
    if (!account) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if(account.refreshToken !== token) {
      return res.status(403).json({ message: "Refresh token mismatch" });
    }

    // ✅ Generate new tokens
    const newAccessToken = generateAccessToken(account);
    const newRefreshToken = generateRefreshToken(account);

    await User.findByIdAndUpdate(userId, { refreshToken: newRefreshToken });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ message: "Tokens refreshed" });

  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = refreshToken;