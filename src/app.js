const express = require("express");
const dbConnect = require("./config/dbConnect");
const User = require("./models/User");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const validationMiddleware = (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (firstName.length > 5 || lastName.length > 5 || !email || !password) {
    return res
      .status(400)
      .json({
        message:
          "Validation failed. Please provide all required fields with valid data.",
      });
  }
  next();
};

app.post("/signup", validationMiddleware, async (req, res) => {
  const data = req.body;
  try {
    await new User(data).save();
    res.status(200).json({ message: "User signed up successfully" });
  } catch (error) {
    res.status(500).json({ message: "User signup failed", error });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "User retrieval failed", error });
  }
});

app.delete("/user", async (req, res) => {
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

app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;
  const allowedUpdates = [
    "firstName",
    "lastName",
    "password",
    "age",
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
