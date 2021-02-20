const Sequelize = require("sequelize");

const sequelize = new Sequelize("visioncraft-express", "root", "", {
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
