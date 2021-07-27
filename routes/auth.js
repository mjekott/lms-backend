const router = require("express").Router();

// controllers
const { register, login, logout, currentUser } = require("../controllers/auth");
const { requiresSignin } = require("../middlewares");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requiresSignin, currentUser);
module.exports = router;
