const express = require("express");
const router = express.Router();
const {verifyProviderOtp , addProvider , getNearestProviders , getProviderDetails} = require("../controller/provider.controller");
const {authMiddleware} = require("../Middleware/authmiddleware")

router.post("/verify-provider-otp", verifyProviderOtp);
router.post("/update-provider", addProvider);
router.get("/getprovider", authMiddleware,getNearestProviders);
router.get("/getproviderdetails",authMiddleware,getProviderDetails);

module.exports = router;