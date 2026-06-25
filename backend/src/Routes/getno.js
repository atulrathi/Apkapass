const express = require("express");
const router = express.Router();
const { getmobileno } = require("../controller/providermobileno");
const {authMiddleware} = require("../Middleware/authmiddleware");

router.get("/getno",authMiddleware,getmobileno);

module.exports = router;