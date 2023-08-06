const { Sequelize } = require("sequelize");
require("dotenv").config();

// Setup sequelize to use PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: console.log,
    dialectOptions: {
      useUTC: true, // for reading from database
      dateStrings: true,
      typeCast: true,
    },
    timezone: "+00:00", // for writing to database
  }
);

module.exports = sequelize;
