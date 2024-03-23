var express = require("express");
var router = express.Router();
const signupValidator = require("../middlewares/validators/auth/signupValidator");
const loginValidator = require("../middlewares/validators/auth/loginValidator");
const UserModel = require("../models/UserModel");
const logError = require("../utils/logError");
const AuthService = require("../services/AuthService");

/* POST user login listing. */
router.post("/login", loginValidator, async (req, res, next) => {
  try {
    const token = await AuthService.login(req.body);
    return res.status(200).json(token);
  } catch (error) {
    return res.status(400).json(logError(error, "An error occurred in login"));
  }
});

/* POST user signup listing. */
router.post("/signup", signupValidator, async (req, res, next) => {
  try {
    await UserModel.store(req.body);
    return res.status(200).json("Signed up");
  } catch (error) {
    return res
      .status(400)
      .json(logError(error, "An error occurred in user creation"));
  }
});

module.exports = router;
