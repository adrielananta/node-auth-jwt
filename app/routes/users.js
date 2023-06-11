const express = require("express");
const { users } = require("../controllers");
const { route } = require("./auth");
const router = express.Router();

router.post("/", users.create);
router.put("/:userId", users.update);
router.get("/:userId", users.read);
router.delete("/:userId", users.destroy);

module.exports = router;