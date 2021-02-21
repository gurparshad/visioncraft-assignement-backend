require("dotenv").config();

const testDbName = process.env.DATABASE_TEST;
const testDbUsername = process.env.DATABASE_USERNAME;
const testDbPawwsord = process.env.DATABASE_PASSWORD;
const testDbDialect = process.env.DATABASE_DIALECT;

module.exports = {
  database: {
    database: testDbName,
    username: testDbUsername,
    password: testDbPawwsord,
    dialect: testDbDialect,
    logging: false,
  },
};
