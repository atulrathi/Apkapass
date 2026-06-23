const express = require("express");
const router = express.Router();
const {dutyToggle} = require("../controller/Dutytiggle");
const {authMiddleware} = require("../Middleware/authmiddleware")

router.post("/dutytoggle", authMiddleware, dutyToggle);

module.exports = router;