const express = require("express");
const { userController } = require("../controllers/UserController");

const userRoutes = express.Router();

userRoutes.post("/confirm", userController.confirmCode);
userRoutes.post("/auth", userController.auth);
userRoutes.post("/forgotpassword", userController.forgotPassword);
userRoutes.post("/newpassword", userController.newPassword);
userRoutes.get("/getUser", userController.getUser);

module.exports = {
  userRoutes,
};
