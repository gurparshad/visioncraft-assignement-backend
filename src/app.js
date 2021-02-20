const express = require("express");
const app = express();
const User = require("./user/User");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/api/1.0/users", (req, res) => {
  console.log("this is re -->>", req.body);
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = { ...req.body, password: hash };
    User.create(user).then(() => {
      return res.send({ message: "user created" });
    });
  });
});

module.exports = app;
