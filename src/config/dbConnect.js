const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async() => await mongoose.connect(`mongodb+srv://139kumargaurav:${process.env.PASSWORD}@namastenodejs.vdyrcme.mongodb.net/devtinder`);

module.exports = dbConnect;