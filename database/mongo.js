const mongoose = require("mongoose");
const { config } = require("dotenv");

config();

if (!process.env.MONGODB_URI) {
  throw new Error("Create a enviroment named MONGODB_URI!!");
}

const url = process.env.MONGODB_URI;
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  phones: Array,
  createdAt: String,
  updateDate: String,
  lastLogin: String,
});

// eslint-disable-next-line prettier/prettier
const userModel = mongoose.models.userModel || mongoose.model('User', userSchema);

module.exports = {
  mongoose,
  userModel,
  url,
};
