const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const Products = sequelize.define(
  "Products",
  {
    id_Product: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      references: {
        model: "Category_products",
        key: "id_Category",
      },
    },
    sku: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING(1024), // Aumentado el límite de caracteres para descripciones más largas
    },
    price: {
      type: DataTypes.FLOAT,
    },

    stock: {
      type: DataTypes.INTEGER,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    offert: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    offertPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAd: false,
  }
);

module.exports = Products;
