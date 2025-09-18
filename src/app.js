const express = require("express");
const dbConnect = require("./config/dbConnect");
const User = require("./models/User");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.post('/signup', async (req, res) => {
    try {
        await new User(req.body).save();
        res.status(200).json({ message: "User signed up successfully" });
    } catch (error) {
        res.status(500).json({ message: "User signup failed", error });
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
