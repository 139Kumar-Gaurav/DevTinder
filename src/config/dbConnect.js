const mongoose = require('mongoose');

const dbConnect = async() => await mongoose.connect('mongodb+srv://139kumargaurav:DVyxoGYiOD7BJBZt@namastenodejs.vdyrcme.mongodb.net/devtinder');

module.exports = dbConnect;