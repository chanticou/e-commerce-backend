// importProducts.js
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// Images route
const imagesFolderPath = path.join(__dirname, "./assets/images/PCGM");

// Leer el archivo Excel
const workbook = XLSX.readFile("actualizaciones.xlsx");
const sheet_name_list = workbook.SheetNames;
const products = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
  range: 1,
});

const groupedProducts = {};

// read images names
const imageFiles = fs.readdirSync(imagesFolderPath);

products.forEach((product) => {
  const imageFile = imageFiles.find((file) => file.includes(product.CODIGO));
  // console.log(imageFile);
  const imageUrl = imageFile
    ? // ? `https://solsoftcomputacion.com.ar//images/PCGM/${imageFile}`
      `http://localhost:3000//images/PCGM/${imageFile}`
    : "https://res.cloudinary.com/dg05pzjsq/image/upload/v1696873639/pexels-sinden-sunna-3029916_xn3wju.jpg";

  const tipo = product.CODIGO.startsWith("PCGM")
    ? "kit_pc_gamer"
    : product.CODIGO.startsWith("PCHO")
    ? "kit_pc_hogar_u_oficina"
    : product.CODIGO.startsWith("AMIC")
    ? "auriculares_microfonos"
    : product.CODIGO.startsWith("CAMA")
    ? "camaras"
    : product.CODIGO.startsWith("COOL")
    ? "combos_actualizacion"
    : product.CODIGO.startsWith("PCHO")
    ? "refrigeracion"
    : product.CODIGO.startsWith("GTES")
    ? "gabinetes"
    : product.CODIGO.startsWith("IMPR")
    ? "impresoras"
    : product.CODIGO.startsWith("JOYS")
    ? "joystick"
    : product.CODIGO.startsWith("MONI")
    ? "monitores"
    : product.CODIGO.startsWith("MOUS")
    ? "mouses"
    : product.CODIGO.startsWith("NOTE")
    ? "note_books"
    : product.CODIGO.startsWith("PEND")
    ? "pen_drives"
    : product.CODIGO.startsWith("REDS")
    ? "conectividad_redes"
    : product.CODIGO.startsWith("TEMO")
    ? "teclado_mouse"
    : product.CODIGO.startsWith("AMIC")
    ? "auriculares_microfonos"
    : product.CODIGO.startsWith("VIDE")
    ? "placas_video"
    : product.CODIGO.startsWith("MICR")
    ? "microprocesador"
    : product.CODIGO.startsWith("MEMO")
    ? "memorias_ram"
    : product.CODIGO.startsWith("ALMA")
    ? "almacenamiento"
    : "otros";

  const newProduct = {
    sku: product.CODIGO,
    nombre: product.PRODUCTO,
    descripcion: product.DESCRIPCION,
    price: product.PRECIO,
    thumbnail: imageUrl,
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

// const categoryMapping = {
//   PEND: "",
//   NOTE: "",
//   MONI: "",
//   IMPR: "",
//   JOYS: "",
//   MOUS: "",
//   CAMA: "",
//   AMIC: "",
//   TEMO: "",
//   COOL: "",
//   COMB: "",
//   REDS: "",
//   GTES: "",
//   FTES: "",
//   VIDE: "",
//   MICR: "",
//   MEMO: "",
//   ALMA: "",
//   MOTH: "motherboard",
//   PCGM: "",
//   PCHO: "",
//   // Agrega más mapeos según sea necesario
// };
