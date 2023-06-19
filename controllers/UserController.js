const { User } = require("../models/User");
const { confirmCodeEmail } = require("../utils/emailService");
var jwt = require("jsonwebtoken");

let privateKey = process.env.PRIVATE_KEY;

const userController = {
  register: (req, res) => {
    // First, check if the email provided by the user exists in the database
    User.findOne({ email: req.body.email }).then((data) => {
      if (!data) {
        // Generate a random code and save it to the database. This code will also be sent to the user's email as a confirmation code
        let randomCode = Math.floor(Math.random() * 10000);
        confirmCodeEmail(req.body.email, randomCode);
        let user = new User({
          email: req.body.email,
          password: req.body.password,
          code: randomCode,
        });
        user
          .save()
          .then((saveRes) => {
            res.json(saveRes);
          })
          .catch((err) => {
            res.status(500).json(err);
          });
      } else {
        res.json({ msg: "This email is already registered in the system!" });
      }
    });
  },
  confirmCode: (req, res) => {
    // console.log("BODY", req.body);
    User.findOne({ email: req.body.email.toLowerCase(), code: req.body.code })
      .then((data) => {
        if (data) {
          let token = jwt.sign(req.body.email, privateKey);
          console.log("TOKENchik", token);
          res.json({ token: token });
        } else {
          res.status(500).json({ msg: "Confirm code error" });
        }
      })
      .catch((err) => {
        res.status(500).send("Mongo error!");
      });
  },
  login: (req, res) => {
    User.findOne({
      email: req.body.email?.toLowerCase(),
      password: req.body.password,
    }).then((data) => {
      if (data) {
        console.log("OKaychik!");
        let randomCode = Math.floor(Math.random() * 10000);
        data.code = randomCode;
        data.save();
        confirmCodeEmail(req.body.email, randomCode);
        res.json({ email: req.body.email });
      } else {
        res.status(404).json({ msg: "Email or password error" });
      }
    });
  },
  forgotPassword: (req, res) => {
    User.findOne({ email: req.body.email }).then((data) => {
      if (data) {
        let randomCode = Math.floor(Math.random() * 10000);
        data.code = randomCode;
        data.save();
        confirmCodeEmail(req.body.email, randomCode);
        res.json({ email: req.body.email });
      } else {
        res.status(404).json({ msg: "Email error" });
      }
    });
  },
  newPassword: (req, res) => {
    User.findOne({ email: req.body.email })
      .then((data) => {
        if (data) {
          data.password = req.body.password;
          data.save();
          res.json({ email: req.body.email });
        }
        {
          res.status(404).json({ msg: "Not found!" });
        }
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
};

module.exports = {
  userController,
};

// The user must enter the confirmation code within 1 minute after requesting a password reset!
// The user is allowed to enter the confirmation code incorrectly for a maximum of 3 times.
