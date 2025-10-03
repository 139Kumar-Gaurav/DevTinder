const express = require("express");
const apis = require("../utils/apis");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { validateSignupData } = require("../utils/validationHelper");
const { userAuth } = require("../middlewares/auth");
const authRouter = express.Router();

authRouter.post(apis.SIGN_UP, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { isValid, error } = validateSignupData({ email, password });
  try {
    if (isValid) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      const savedUser = await new User({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
      }).save();
      const token = await savedUser.getJWT();
      res
        .cookie("token", token)
        .status(200)
        .json({ message: "User signed up successfully", data: savedUser });
    } else {
      throw new Error(error);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "User signup failed", error: error.toString() });
  }
});

authRouter.post(apis.LOGIN, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isValidPassword = await user?.validatePassword(password);
    if (!user || !isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      const token = await user.getJWT();
      res.cookie("token", token).status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.toString() });
  }
});

authRouter.post(apis.LOGOUT, userAuth, (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
});

module.exports = authRouter;
