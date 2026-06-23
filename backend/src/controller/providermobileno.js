const user = require("../models/user");

exports.getmobileno = async (req, res) => {
  try {
    const { userID } = req.query;

    if (!userID) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const providerno = await user
      .findById(userID)
      .select("phone");

    if (!providerno) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      phone: providerno.phone,
    });
  } catch (error) {
    console.error("Error fetching mobile number:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};