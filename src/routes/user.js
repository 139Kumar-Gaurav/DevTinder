const express = require("express");
const apis = require("../utils/apis");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const userRouter = express.Router();

const CONNECTION_DATA = "firstName lastName age gender imageUrl about skills";

userRouter.get(apis.USER_REQUESTS_RECEIVED, userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requestedUsers = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", CONNECTION_DATA);
    if (!requestedUsers.length) {
      return res.status(404).json({ message: "No requests found" });
    }
    res.status(200).json({
      message: "Fetched requested users successfully",
      data: requestedUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message.toString(),
    });
  }
});

userRouter.get(apis.USER_CONNECTIONS, userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectedUsers = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", CONNECTION_DATA)
      .populate("toUserId", CONNECTION_DATA);
    if (!connectedUsers.length) {
      return res.status(404).json({ message: "No connections found" });
    }

    const userConnections = connectedUsers.map((connection) => {
      if (connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    res.status(200).json({
      message: "Fetched connections successfully",
      totalConnections: userConnections.length,
      data: userConnections,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch connections",
      error: error.message.toString(),
    });
  }
});

module.exports = userRouter;
