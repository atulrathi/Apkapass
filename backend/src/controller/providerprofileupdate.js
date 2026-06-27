const provider = require("../models/provider");

const updateProfileImage = async (req, res) => {
  try {
    const { id } = req.user;
    const { profileImage } = req.file;

    console.logg(id, profileImage);

    await provider.findByIdAndUpdate(
      id,
      { profileImage },
      { new: true }
    );

    res.status(200).json({
      success: true,
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