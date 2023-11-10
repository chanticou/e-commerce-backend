const User = require("../models/users.js");

// const createUser = async (req, res) => {
//   const { email, nickname, name, picture, family_name, given_name } = req.body;
//   try {
//     let createUserDB;
//     let response;
//     if (!email) throw new Error("Falta ingresar datos");

//     let userExists = await User.findOne({
//       where: {
//         email: email,
//       },
//     });

//     if (!userExists) {
//       createUserDB = await User.create({
//         name: name,
//         nickname: nickname,
//         email: email,
//         picture: picture,
//         family_name: family_name,
//         given_name: given_name,
//       });
//     }
//     // throw new Error("Ya tienes una cuenta creada!", userExists.email);

//     // Suponiendo que isAdmin es true si el email es 'chanticou@gmail.com'
//     const isAdmin = email === "chanticou@gmail.com";
//     // console.log(isAdmin);
//     if (userExists) {
//       response = userExists;
//     } else {
//       response = createUserDB;
//     }

//     res.status(200).json({
//       message: "Success",
//       payload: {
//         user: response.toJSON(),
//         isAdmin: isAdmin,
//       },
//     });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

const createUser = async (req, res) => {
  const { email, nickname, name, picture, family_name, given_name } = req.body;

  try {
    if (!email) throw new Error("Falta ingresar datos");

    const userType = email === "chanticou@gmail.com" ? "admin" : "user";
    console.log("User Type:", userType);

    let userExists = await User.findOne({ where: { email } });

    if (userExists) {
      console.log("El usuario ya existe:", userExists.email);
    } else {
      const newUser = await User.create({
        name,
        nickname,
        email,
        picture,
        family_name,
        given_name,
        user_type: userType,
      });
      console.log("Nuevo usuario creado:", newUser.email);
      return res.status(200).json({
        message: "Success",
        payload: { user: newUser.toJSON() },
      });
    }

    res.status(200).json({
      message: "Usuario ya existente",
      payload: { user: userExists.toJSON() },
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createUser };
