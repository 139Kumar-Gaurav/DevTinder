const express = require('express');
const apis = require("../utils/apis");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express.Router();

profileRouter.get(apis.PROFILE, userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }
    res.send(
      `Welcome to your profile! ${user.firstName} ${user.lastName}` + user
    );
  } catch (error) {
    res.status(500).json({ message: "Profile retrieval failed", error });
  }
});

module.exports = profileRouter;