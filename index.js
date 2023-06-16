const express = require("express");
const app = express();
const { userRoutes } = require("./routes/userRoutes");
const { db } = require("./config/db");
const jwt = require("jsonwebtoken");
let privateKey = process.env.PRIVATE_KEY;
app.use(express.json());

db.connect();

app.use((req, res, next) => {
  if (req.url == "/api/user/confirm" || req.url == "/api/user/auth") {
    next();
  } else {
    if (req.headers.authorization) {
      let data = req.headers.authorization.split(" ");
      if (data.length == 2 && data[0] == "Bearer") {
        let token = data[1];
        try {
          jwt.verify(token, privateKey);
          next();
        } catch (error) {
          res.status(403).json("token error");
        }
      }
    } else {
      res.status(403).json("token error");
    }
  }
});

app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Server is running...");
});
