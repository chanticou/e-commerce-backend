const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const Category_products = sequelize.define("Category_products", {
  id_Category: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.STRING,
  },
  thumbnail: {
    type: DataTypes.STRING,
  },
});

module.exports = Category_products;
