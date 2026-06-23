const express = require("express");
const router = express.Router();

const {addService , getAllServices} = require("../controller/Addservice");
const {authMiddleware} =require("../Middleware/authmiddleware");
const upload = require("../Middleware/upload");

router.post("/addservice", authMiddleware, upload.array("images", 5), addService);
router.get("/getservices", authMiddleware, getAllServices);

module.exports = router;