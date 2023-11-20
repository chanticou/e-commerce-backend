const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const sequelize = require("./config/db.js");
const PORT = 4000;
const path = require("path");
// Importo las asociaciones
require("./models/associations.js");
const { saveDataBase } = require("./controllers/products_controller.js");
require("dotenv").config();

//midlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//dontenv
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv");
// }
// Serve static files from the 'img' directory
app.use("/public", express.static(path.join(__dirname, "public")));

//ROUTES
app.use("/", require("./routes/users_routes.js"));
app.use("/", require("./routes/products_routes.js"));
app.use("/", require("./routes/category_routes.js"));

app.use("/", require("./routes/payments_routes.js"));
app.use("/images", express.static(path.join(__dirname, "/assets/images")));

sequelize
  .authenticate()
  .then(() => console.log("DB-CONNECTED"))
  .catch((err) => console.log(err.message));

(async function () {
  await sequelize.sync({ force: false });
  saveDataBase();
  console.log("Datos guardados en la BD");
  app.listen(PORT, () => console.log("Listening on port ", PORT));
})();
