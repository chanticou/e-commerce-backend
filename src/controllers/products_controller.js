const Products = require("../models/products.js");
const Category_products = require("../models/category_products.js");
// const allProducts = require("../services/allProducts.json");

const fs = require("fs").promises;

const saveDataBase = async (req, res) => {
  try {
    // Read file json
    const data = await fs.readFile(
      "../api/src/services/allProducts.js",
      "utf8"
    );
    const allProducts = JSON.parse(data);

    const productCount = await Products.count();
    const categoryCount = await Category_products.count();

    if (productCount === 0 && categoryCount === 0) {
      for (const categoryKey in allProducts) {
        const productArray = allProducts[categoryKey];

        const category = await Category_products.create({
          type: categoryKey,
        });

        for (const product of productArray) {
          await Products.create({
            categoryId: category.id_Category,
            sku: product.sku,
            name: product.nombre,
            description: product.descripcion,
            thumbnail: product.thumbnail,
            price: product.price,
            stock: product.stock,
          });
        }
      }
      console.log("Data saved successfully");
    } else {
      console.log("Data already exists");
    }
  } catch (err) {
    console.log(err);
  }
};

const getAllProducts = async (req, res) => {
  try {
    // await saveDataBase();
    let callDB = await Products.findAll();
    console.log(callDB);

    if (!callDB.length)
      res.send({
        message: "No hay productos en la base de datos",
      });
    res.status(200).json({ message: "Scucces", payload: callDB });
  } catch (err) {
    return err.message;
  }
};
const createProduct = async (req, res) => {
  try {
    let body = req.body;
    let file = req.file;

    if (!file) throw new Error("No se cargo correctamente la imagen");

    body.thumbnail = `${req.protocol}://${req.hostname}:4000/public/img/${file.filename}`;

    if (body.offert && !body.offertPrice) {
      throw new Error(
        "Se especificó oferta pero no se proporcionó el precio de oferta."
      );
    }
    const product = await Products.create(body);
    console.log(product);
    res
      .status(201)
      .json({ message: "Producto creado", payload: product.toJSON() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteProductDataBase = async (req, res) => {
  try {
    const id_Product = req.params.id_product;
    const data = req.body;
    console.log(req.params);
    const product = await Products.findOne({
      where: {
        id_Product: id_Product,
      },
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ message: "Product successfully deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Products.findOne({
      where: { id_Product: id },
    });

    if (product) {
      res.json({ payload: product });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
const UpdateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const { id_Product, products, thumbnail, ...dataToUpdate } = updateData;

  try {
    await Products.update(dataToUpdate, {
      where: {
        id_Product: id,
      },
    });

    const updatedProduct = await Products.findOne({
      where: { id_Product: id },
    });

    res.status(200).json({
      message: "Producto actualizado con éxito",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  saveDataBase,
  getAllProducts,
  createProduct,
  deleteProductDataBase,
  getById,
  UpdateProduct,
};
