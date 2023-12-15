require("dotenv").config();
const { Sequelize } = require("sequelize");
const encodedPassword = encodeURIComponent(process.env.DB_PASSWORD);

const { DB_USER, DB_HOST, DB_DATABASE } = process.env;

const sequelize = new Sequelize(
  `postgres://eltwcqez_postgres:${encodedPassword}@${DB_HOST}:5432/${DB_DATABASE}`,
  {
    host: DB_HOST,
    dialect: "postgres",
    port: 5432,
    logging: false,
  }
);

module.exports = sequelize;
