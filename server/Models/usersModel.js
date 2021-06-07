const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const usersSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  userType: { type: String, required: true },
  available: { type: Boolean, default: true },
  password: { type: String, required: true },
  confPass: { type: String },
});

usersSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
      this.confPass = "";
    }
  } catch (e) {
    console.log(e);
  }
  next();
});

const UsersModel = new mongoose.model("user", usersSchema);
module.exports = UsersModel;
