const router = require("express").Router();
const controller = require("../controllers/category_controller");

router.get("/categories", controller.getAllCategories);
router.get("/products/category/:categoryId", controller.getProductsByCategory);

module.exports = router;
