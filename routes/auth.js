const express = require("express");
const { register, login, verify } = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify/:token", verify);

module.exports = router;
