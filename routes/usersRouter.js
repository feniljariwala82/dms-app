const express = require("express");
const router = express.Router();
const signupValidator = require("../middlewares/validators/auth/signupValidator");
const loginValidator = require("../middlewares/validators/auth/loginValidator");
const UserModel = require("../models/UserModel");
const logError = require("../utils/logError");
const AuthService = require("../services/AuthService");
const authMiddleware = require("../middlewares/auth/authenticated");
const guestMiddleware = require("../middlewares/auth/guest");
const { addToBlacklist } = require("../config/blacklist");

/* GET user */
router.get("/", authMiddleware, (req, res, next) => {
  return res.status(200).json(req.user);
});

/* POST user login */
router.post(
  "/login",
  guestMiddleware,
  loginValidator,
  async (req, res, next) => {
    try {
      const token = await AuthService.login(req.body);
      return res.status(200).json(token);
    } catch (error) {
      return res
        .status(400)
        .json(logError(error, "An error occurred in login"));
    }
  }
);

/* POST user signup */
router.post(
  "/signup",
  guestMiddleware,
  signupValidator,
  async (req, res, next) => {
    try {
      await UserModel.store(req.body);
      return res.status(200).json("Signed up");
    } catch (error) {
      return res
        .status(400)
        .json(logError(error, "An error occurred in user creation"));
    }
  }
);

/* POST user logout */
router.post("/logout", authMiddleware, (req, res, next) => {
  // maintaining the blacklisted tokens
  addToBlacklist(req.authToken);
  return res.status(200).json("Logged out");
});

module.exports = router;
