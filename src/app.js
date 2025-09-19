const express = require("express");
const dbConnect = require("./config/dbConnect");
const User = require("./models/User");
const { validateSignupData } = require("./utils/validationHelper");
const jwt = require("jsonwebtoken");
const apis = require("./utils/apis");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post(apis.SIGN_UP, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { isValid, error } = validateSignupData({ email, password });
  try {
    if (isValid) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      await new User({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
      }).save();
      res.status(200).json({ message: "User signed up successfully" });
    } else {
      throw new Error(error);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "User signup failed", error: error.toString() });
  }
});

app.post(apis.LOGIN, async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isValidPassword = await user?.validatePassword(password);
    if (!user || !isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      const token = await user.getJWT();
      res.cookie("token", token);
      res.status(200).json({ message: "Login successful", user });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.toString() });
  }
});

app.post(apis.LOGOUT, userAuth, (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Logout failed", error });
  }
});

app.get(apis.PROFILE, userAuth, async (req, res) => {
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

app.post(apis.SEND_CONNECTION_REQUEST, userAuth, (req, res) => {
  try {
    res.status(200).json({ message: `Connection request sent successfully by ${req.user.firstName} ${req.user.lastName}` });
  } catch (error) {
    res.status(500).json({ message: "Connection request failed", error });
  }
});

dbConnect()
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    })
  )
  .catch((err) => {
    console.log("Database connection failed", err);
  });
