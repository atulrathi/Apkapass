const Service = require("../models/Serviceschema");
const Provider = require("../models/provider");

exports.addService = async (req, res) => {
  try {
    const providerId = req.user?.id;

    // ---------------- AUTH CHECK ----------------

    if (!providerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // ---------------- BODY DATA ----------------

    let { name, description } = req.body;

    // ---------------- VALIDATION ----------------

    name = name?.trim().toLowerCase();
    description = description?.trim() || "";

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Service name is required",
      });
    }

    // ---------------- IMAGE PROCESSING ----------------

    const images =
      req.files?.map((file) => ({
        url: file.path,
        publicId: file.filename,
      })) || [];

    // ---------------- CREATE SERVICE ----------------

    const service = await Service.create({
      name,
      description,
      providerId,
      images,
    });
    
    // ---------------- RESPONSE ----------------

    return res.status(201).json({
      success: true,
      message: "Service added successfully",
      service,
    });

  } catch (error) {

    // ---------------- DUPLICATE ERROR ----------------

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Service already exists",
      });
    }

    console.error("Add Service Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.getAllServices = async (req, res) => {
    try{
        const providerId = req.user?.id;
        if(!providerId){
            return res.status(401).json({
                success : false,
                message : "Unauthorized access"
            });
        }
        const services = await Service.find({providerId: providerId}).lean();
        return res.status(200).json({
            success : true,
            message : "Services fetched successfully",
            services
        });
    }catch(error){
        console.error("Get Services Error:", error);
        return res.status(500).json({
            success : false,
            message : "Internal server error"
        });
    }
}