require("dotenv").config();

module.exports = {
  database: {
    database: process.env.DATABASE_DEV,
    username: "root",
    password: "",
    dialect: "mysql",
    logging: false,
  },
};
