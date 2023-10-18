const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const userController = require("../controllers/user-controller");
router.route("/").get(userController.allUsers);

router.post(
  "/signup",
  check("username").not().isEmpty(),
  check("email").normalizeEmail().isEmail(),
  check("password").isLength({ min: 8 }),
  userController.signUp,
);
router.post("/login", userController.loginIn);
router.route("/:uid").get(userController.getUserById);

module.exports = router;
