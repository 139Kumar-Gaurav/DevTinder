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
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!user || !isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.cookie("token", token,);
      res.status(200).json({ message: "Login successful", user });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

app.get(apis.PROFILE, async (req, res) => {
    try{
        const cookie = req.cookies;
        const decoded = jwt.verify(cookie.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user){
            throw new Error("User not found");
        }
        res.send(`Welcome to your profile! ${user.firstName} ${user.lastName}` + user);
    } catch (error) {
        res.status(500).json({ message: "Profile retrieval failed", error });
    }
});

app.get(apis.FEED, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "User retrieval failed", error });
  }
});

app.delete(apis.USER, async (req, res) => {
  try {
    const userToBedeleted = await User.findById(req.body.id);
    if (!userToBedeleted) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(req.body.id);
    res
      .status(200)
      .json(
        `${
          userToBedeleted.firstName + " " + userToBedeleted.lastName
        } deleted successfully`
      );
  } catch (error) {
    res.status(500).json({ message: "User deletion failed", error });
  }
});

app.patch(apis.UPDATE_USER, async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  const allowedUpdates = [
    "firstName",
    "lastName",
    "password",
    "age",
    "gender",
    "imageUrl",
    "about",
    "skills",
  ];
  try {
    const allowed = Object.keys(data).every((update) =>
      allowedUpdates.includes(update)
    );
    if (!allowed) {
      throw new Error("Invalid updates detected: ");
    }
    const updatedUsers = await User.findByIdAndUpdate(userId, data, {
      returnOriginal: false,
      runValidators: true,
    });
    if (!updatedUsers) {
      throw new Error("User not found");
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUsers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "User update failed", error: error.toString() });
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
