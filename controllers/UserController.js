const { User } = require("../models/User");
const { confirmCodeEmail } = require("../utils/emailService");
const jwt = require("jsonwebtoken");
let privateKey = process.env.PRIVATE_KEY;

const userController = {
  confirmCode: (req, res) => {
    User.findOne({ email: req.body.email, code: req.body.code })
      .then((data) => {
        if (data) {
          let token = jwt.sign({ email: req.body.email }, privateKey, {
            algorithm: "HS256",
            expiresIn: "30d",
            issuer: "iron maiden ın tokenı",
          });
          data.isConfirm = true;
          data.save();
          res.json({ email: req.body.email, token });
        } else {
          res.status(404).json({ msg: "Confirm Code error" });
        }
      })
      .catch((err) => {
        res.status(500).send("Mongo error!", err.message);
      });
  },
  auth: (req, res) => {
    const randomCode = Math.floor(Math.random() * 10000);
    User.findOne({ email: req.body.email }).then(async (data) => {
      if (data) {
        data.code = randomCode;
        await data.save();

        confirmCodeEmail(req.body.email, randomCode);
        res.json({ email: req.body.email });
      } else {
        confirmCodeEmail(req.body.email, randomCode);
        const newUser = new User({
          email: req.body.email,
          code: randomCode,
        });
        newUser.save();
        res.json({ email: newUser.email });
      }
    });
  },
  forgotPassword: (req, res) => {
    User.findOne({ email: req.body.email }).then((data) => {
      if (data) {
        var randomCode = Math.floor(Math.random() * 10000);
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
  getUser: (req, res) => {
    let data = req.headers.authorization.split(" ");
    const email = jwt.decode(data[1]).email;
    res.json({
      text: `gizli melumat, mailin uzunlugu ${email.length} ${email}`,
    });
    console.log("sa", email);
  },
};

module.exports = {
  userController,
};
