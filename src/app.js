const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const UserRouter = require("./user/UserRouter");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(UserRouter);

module.exports = app;
