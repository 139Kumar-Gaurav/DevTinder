const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://139kumargaurav:h50g5Q2F96EPz51q@namastenodejs.vdyrcme.mongodb.net/devtinder"
    );
  } catch (err) {
    console.log("error in connecting ", err);
  }
};

module.exports = dbConnect;
