// routes/products_routes.js
const router = require("express").Router();
const controller = require("../controllers/products_controller");
const uploaderImages = require("../services/Upload.js");

router.get("/getAllProducts", controller.getAllProducts);

router.post(
  "/createProduct",
  uploaderImages.single("thumbnail"),
  // VerifyToken,
  controller.createProduct
);

router.delete("/deleteProduct/:id_product", controller.deleteProductDataBase);

router.get("/getProductById/:id", controller.getById);

router.put("/updateProduct/:id", controller.UpdateProduct);

module.exports = router;
