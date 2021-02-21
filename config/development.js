require("dotenv").config();

const dbName = process.env.DATABASE_DEV;
const dbUsername = process.env.DATABASE_USERNAME;
const dbPawwsord = process.env.DATABASE_PASSWORD;
const dbDialect = process.env.DATABASE_DIALECT;

module.exports = {
  database: {
    database: dbName,
    username: dbUsername,
    password: dbPawwsord,
    dialect: dbDialect,
    logging: false,
  },
};
