const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp } = require("../controller/auth.controller");
const refreshtoken = require("../controller/refreshtoken");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/refresh",refreshtoken)

module.exports = router;