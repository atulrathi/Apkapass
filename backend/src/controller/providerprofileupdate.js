const provider = require("../models/provider");

const updateProfileImage = async (req, res) => {
  try {
    const { id } = req.user;
    const { path } = req.file;

    await provider.findByIdAndUpdate(
      id,
      { profileImage : path },
      { new: true }
    );

    res.status(200).json({
      success: true,
      path
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile image"
    });
  }
};

module.exports = { updateProfileImage };