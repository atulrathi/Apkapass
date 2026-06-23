const Provider = require("../models/provider");

exports.dutyToggle = async (req, res) => {
  try {
    const providerId = req.user?.id;

    if (!providerId) {
      return res.status(401).json({
        success: false,
       message: "Unauthorized access",
      });
    }

    const providerData = await Provider.findOneAndUpdate(
      { _id: providerId },
      [
        {
          $set: {
            duty: {
              $cond: [{ $eq: ["$duty", true] }, false, true],
            },
          },
        },
      ],
      {
        returnDocument: "after",
        projection: { duty: 1 },
        updatePipeline: true,
      }
    );

    if (!providerData) {
      return res.status(404).json({
        success: false,
        message: "Provider not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      message: `Provider is now ${
        providerData.duty ? "Online" : "Offline"
      }`,
      data: {
        duty: providerData.duty,
      },
    });

  } catch (error) {
    console.error("Duty Toggle Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};