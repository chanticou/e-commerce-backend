const Products = require("../models/products");
const Category_products = require("../models/category_products");

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category_products.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const products = await Products.findAll({
      where: { categoryId: categoryId },
    });
    console.log(products);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllCategories, getProductsByCategory };
