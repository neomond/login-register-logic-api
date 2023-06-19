const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  code: String,
  // isConfirm: { type: Boolean, default: false },
});
const User = new mongoose.model("User", userSchema);

module.exports = {
  User,
};
