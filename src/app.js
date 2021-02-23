const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const UserRouter = require("./user/UserRouter");
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(UserRouter);

app.use("/", (req, res) => {
  console.log("hello world");
  return res.send({ message: "API working" });
});

module.exports = app;
