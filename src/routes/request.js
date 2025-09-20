const express = require('express');
const apis = require("../utils/apis");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post(apis.SEND_CONNECTION_REQUEST, userAuth, (req, res) => {
  try {
    res.status(200).json({ message: `Connection request sent successfully by ${req.user.firstName} ${req.user.lastName}` });
  } catch (error) {
    res.status(500).json({ message: "Connection request failed", error });
  }
});

module.exports = requestRouter;