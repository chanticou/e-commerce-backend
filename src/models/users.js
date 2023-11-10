const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.

const User = sequelize.define(
  // defino el modelo
  "User",
  {
    id_User: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    nickname: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    picture: {
      type: DataTypes.STRING,
      defaultValue:
        "https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png",
    },
    family_name: {
      type: DataTypes.STRING,
    },
    given_name: {
      type: DataTypes.STRING,
    },
    user_type: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
    },
    // logued: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },
    // user_type: {
    //   type: DataTypes.ENUM("admin", "user"),
    // },
  },
  {
    timestamps: false,
    createdAt: false,
    updatedAd: false,
  }
);

module.exports = User;
