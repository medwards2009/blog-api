const express = require("express");
const { createConfig } = require("../controllers/config");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.route("/create").post(protect, authorize("admin"), createConfig);

module.exports = router;
