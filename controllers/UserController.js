const { User } = require("../models/User");
const { confirmCodeEmail } = require("../utils/emailService");

const userController = {
  SendMailReq: async (req, res) => {
    const randomCode = Math.floor(1000 + Math.random() * 900000);
    await confirmCodeEmail(req.body.email, randomCode);
    res.sendStatus(200);
  },

  register: async (req, res) => {
    try {
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.json({ msg: "This email is already registered!" });
      }

      const randomCode = Math.floor(Math.random() * 10000);
      await confirmCodeEmail(req.body.email, randomCode);

      const newUser = new User({
        email: req.body.email,
        password: req.body.password,
        code: randomCode,
      });

      const savedUser = await newUser.save();
      res.json(savedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  confirmCode: async (req, res) => {
    try {
      const { email, code } = req.body;
      const user = await User.findOne({ email, code });
      if (user) {
        res.json({ email });
      } else {
        res.status(404).json({ msg: "Confirmation code error" });
      }
    } catch (err) {
      res.status(500).send("Mongo error!");
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email, password });
      if (user) {
        const randomCode = Math.floor(Math.random() * 10000);
        user.code = randomCode;
        await user.save();
        await confirmCodeEmail(email, randomCode);
        res.json({ email });
      } else {
        res.status(404).json({ msg: "Email or password error" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        const randomCode = Math.floor(Math.random() * 10000);
        user.code = randomCode;
        await user.save();
        await confirmCodeEmail(email, randomCode);
        res.json({ email });
      } else {
        res.status(404).json({ msg: "Email not found" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },

  newPassword: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        user.password = password;
        await user.save();
        res.json({ email });
      } else {
        res.status(404).json({ msg: "User not found!" });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = {
  userController,
};
