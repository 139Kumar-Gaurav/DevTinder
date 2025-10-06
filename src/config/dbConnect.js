const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.PASSWORD);
  } catch (err) {
    console.log("error in connecting ", err);
  }
};

module.exports = dbConnect;
