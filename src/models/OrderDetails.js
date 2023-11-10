const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      // Foreign Key de Order
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      // Foreign Key de Product
      type: DataTypes.UUID,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    // Puedes agregar otros campos aquí si es necesario, por ejemplo, un nombre de producto,
    // en caso de que el producto sea eliminado en el futuro pero aún quieras tener un registro
    // del nombre original en el detalle de la orden.
  },
  {
    timestamps: false,
  }
);

module.exports = OrderDetail;
