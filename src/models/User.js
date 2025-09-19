const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 10,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Add a strong password");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (
          ["male", "female", "other"].includes(value.toLowerCase()) === false
        ) {
          throw new Error("Invalid gender");
        }
      },
    },
    imageUrl: {
      type: String,
      default: "https://sclpa.com/wp-content/uploads/2022/10/dummy-img-1.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "I am a Software Engineer",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
