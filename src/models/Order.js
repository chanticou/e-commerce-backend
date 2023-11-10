const { DataTypes } = require("sequelize");
const sequelize = require("../config/db.js");

const Order = sequelize.define(
  "Order",
  {
    id_order: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "Users",
        key: "id_User",
      },
      field: "user_id",
    },

    id_mercado_pago: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    status_detail: {
      type: DataTypes.STRING,
    },
    payment_method_id: {
      type: DataTypes.STRING,
    },
    payment_type_id: {
      type: DataTypes.STRING,
    },
    transaction_amount: {
      type: DataTypes.DECIMAL(10, 2),
    },
    transaction_amount_refunded: {
      type: DataTypes.DECIMAL(10, 2),
    },
    installments: {
      type: DataTypes.INTEGER,
    },
    external_reference: {
      type: DataTypes.STRING,
    },
    payer_id: {
      type: DataTypes.STRING,
    },
    payer_email: {
      type: DataTypes.STRING,
    },
    payer_identification: {
      type: DataTypes.JSON,
    },
    additional_info: {
      type: DataTypes.JSON,
    },
    date_created: {
      type: DataTypes.DATE,
    },
    date_approved: {
      type: DataTypes.DATE,
    },
    date_last_updated: {
      type: DataTypes.DATE,
    },
    currency_id: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    live_mode: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Order;
