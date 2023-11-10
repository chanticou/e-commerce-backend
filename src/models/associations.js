const Category_products = require("./category_products");
const Products = require("./products");
const Order = require("./Order");
const User = require("./users");
const OrderDetails = require("./OrderDetails");

Category_products.hasMany(Products, {
  foreignKey: "categoryId",
  as: "products",
});

Products.belongsTo(Category_products, {
  foreignKey: "categoryId",
  as: "category",
});

// un usuario tiene muchas ordenes
User.hasMany(Order, {
  foreignKey: "user_id",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Order.hasMany(OrderDetails, {
  foreignKey: "orderId",
  as: "orderDetails",
});

OrderDetails.belongsTo(Order, { foreignKey: "orderId" });

OrderDetails.belongsTo(Products, { foreignKey: "productId" });
Products.hasMany(OrderDetails, { foreignKey: "productId" });
