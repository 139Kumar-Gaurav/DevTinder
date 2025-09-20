require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    console.log("Cookie:", cookie);
    const decoded = await jwt.verify(cookie.token, process.env.JWT_SECRET);
    if (decoded) {
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return res.status(401).send("Unauthorized: User not found");
      }
      req.user = currentUser;
      next();
    } else {
      res.status(401).send("Unauthorized: Invalid user token");
    }
  } catch (error) {
    res.status(401).send("Unauthorized: No token provided");
  }
};

module.exports = { userAuth };
