const router = require("express").Router();

// controllers
const { register, login } = require("../controllers/auth");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
