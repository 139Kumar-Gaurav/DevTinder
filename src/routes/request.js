const express = require('express');
const apis = require("../utils/apis");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequest");
const requestRouter = express.Router();

requestRouter.post(apis.SEND_CONNECTION_REQUEST, userAuth, async (req, res) => {
  try {
    const { status, toUserId } = req.params;

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId: req.user._id,
      toUserId,
      status,
    });
    await connectionRequest.save();
    res.status(200).json({ message: `${toUser.firstName} is marked ${status} by ${req.user.firstName}` });
  } catch (error) {
    res.status(500).json({ message: "Connection request failed", error });
  }
});

module.exports = requestRouter;