const router = require("express").Router();
const controller = require("../controllers/payment_controller");

router.post("/createOrder", controller.CreateOrder);

router.get("/success", controller.Success);
router.get("/failure", controller.Failure);
router.get("/pending", controller.Pending);

router.post("/webhook", controller.recibingWebhook);
router.get("/paymentDetails/:userId", controller.GetPaymentDetails);
router.get("/getAllPayments", controller.GetAllPayments);

module.exports = router;
