const express = require("express");
const router = express.Router();
const { getmobileno } = require("../controller/providermobileno");
const {authMiddleware} = require("../Middleware/authmiddleware");

router.get("/getno",getmobileno);

module.exports = router;