const express = require("express");
const router = express.Router();
const auth = require("./auth");
const users = require("./users");

const { level } = require("../controllers");


router.use("/auth", auth);
router.use("/users", users)

router.post("/level", level.create);
router.get("/level/:level", level.get);

module.exports = router;