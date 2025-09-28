const express = require("express");
const apis = require("../utils/apis");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const userRouter = express.Router();

userRouter.get(apis.USER_REQUESTS_RECEIVED, userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestedUsers = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");
    if (!requestedUsers.length) {
      return res.status(404).json({ message: "No requests found" });
    }
    res
      .status(200)
      .json({
        message: "Fetched requested users successfully",
        data: requestedUsers,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to fetch requests",
        error: error.message.toString(),
      });
  }
});

module.exports = userRouter;
