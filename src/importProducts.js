// importProducts.js
const XLSX = require("xlsx");
const fs = require("fs");

// Leer el archivo Excel
const workbook = XLSX.readFile("Chantal prueba 1.xlsx");
const sheet_name_list = workbook.SheetNames;
const products = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
  range: 1,
});

const groupedProducts = {};

products.forEach((product) => {
  const tipo = product.CODIGO.startsWith("PCGM")
    ? "kit_pc_gamer"
    : product.CODIGO.startsWith("PCHO")
    ? "kit_pc_hogar_u_oficina"
    : "otros";

  const newProduct = {
    sku: product.CODIGO,
    nombre: product.PRODUCTO,
    descripcion: product.DESCRIPCION,
    price: product.PRECIO,
    thumbnail: "URL IMAGEN",
    stock: product.STOCK,
  };
  if (!groupedProducts[tipo]) {
    groupedProducts[tipo] = [];
  }
  groupedProducts[tipo].push(newProduct);
});

fs.writeFile(
  "./services/allProducts.js",
  JSON.stringify(groupedProducts, null, 2),
  (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  }
);

// const DeleteProducts = async () => {
//   const filePath = "./services/allProducts.js";

//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error(err.message);
//       return;
//     }
//     console.log("Archivo eliminado correctamente.");
//   });
// };
// DeleteProducts();
