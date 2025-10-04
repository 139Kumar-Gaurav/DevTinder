const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = async() => await mongoose.connect(`mongodb+srv://139kumargaurav:DVyxoGYiOD7BJBZt@namastenodejs.vdyrcme.mongodb.net/devtinder`);

module.exports = dbConnect;