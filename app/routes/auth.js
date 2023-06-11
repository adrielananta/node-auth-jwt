const express = require("express");
const { auth } = require("../controllers")
const router = express.Router();

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.post("/newAccessToken", auth.newAccessToken);

module.exports = router;