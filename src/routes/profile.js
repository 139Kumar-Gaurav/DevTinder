const express = require('express');
const apis = require("../utils/apis");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { userAuth } = require("../middlewares/auth");
const { validateUpdateData } = require("../utils/validationHelper");
const profileRouter = express.Router();

profileRouter.get(apis.PROFILE_VIEW, userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }
    res.send(
      user
    );
  } catch (error) {
    res.status(500).json({ message: "Profile retrieval failed", error });
  }
});

profileRouter.patch(apis.PROFILE_EDIT, userAuth, async (req, res) => {
    if(!validateUpdateData(req.body)) {
        return res.status(400).json({ message: "Invalid updates!" });
    }

    try {
        const user = req.user;
        Object.keys(req.body).forEach((key) => user[key] = req.body[key]);
        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Profile update failed", error: error.toString() });
    }
});

profileRouter.patch(apis.PROFILE_PASSWORD_EDIT, userAuth, async (req, res) => {
  try {
    if(!validator.isStrongPassword(req.body.password)) {
      throw new Error("Weak password");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.user.password = hashedPassword;
    await req.user.save();
    res.status(200).clearCookie('token').json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Password update failed", error: error.toString() });
  }
});

module.exports = profileRouter;