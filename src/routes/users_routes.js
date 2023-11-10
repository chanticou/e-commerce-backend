const router = require("express").Router();
const controller = require("../controllers/users_controller");

router.post("/signIn", controller.createUser);

module.exports = router;
