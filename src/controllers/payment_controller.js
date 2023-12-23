const mercadopago = require("mercadopago");
const Products = require("../models/products.js");
const Order = require("../models/Order.js");
const winston = require("winston");
require("dotenv").config();

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_TOKEN,
});
const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
const CreateOrder = async (req, res) => {
  const { total, cart, user } = req.body;
  let serverTotal = 0;
  try {
    // Validación y cálculo del total del servidor
    for (let item of cart) {
      const productFromDB = await Products.findByPk(item.id_Product);
      // console.log(productFromDB);
      if (!productFromDB) {
        return res.status(400).send({
          error: "Producto no encontrado.",
          productId: item.id_Product,
        });
      } else {
        const priceToCheck = productFromDB.offert
          ? productFromDB.offertPrice
          : productFromDB.price;

        serverTotal += priceToCheck * item.quantity;
      }

      // if (productFromDB.stock < item.quantity) {
      //   return res
      //     .status(400)
      //     .send({ message: "No hay suficiente stock del producto." });
      // }
    }

    if (serverTotal !== total) {
      return res
        .status(400)
        .send({ message: "El precio del producto no coincide." });
    }
    if (serverTotal !== total) {
      return res.status(400).send({
        message: "El total enviado no coincide con el total calculado.",
      });
    }
    const items = cart.map((product) => ({
      id_Product: product.id_Product,
      title: product.name,
      unit_price: product.offert ? product.offertPrice : product.price,
      quantity: product.quantity,
      currency_id: "ARS",
    }));

    const preference = {
      items: items,
      // ACTUALIZAR ESTAR URLS HARCODEADAS
      // success: "https://solsoftcomputacion.com.ar//approved",
      // failure: "https://solsoftcomputacion.com.ar//failure",
      // pending: "https://solsoftcomputacion.com.ar//pending",
      back_urls: {
        success: "https://5617-181-4-221-91.ngrok-free.app/approved",
        failure: "https://5617-181-4-221-91.ngrok-free.app/failure",
        pending: "https://5617-181-4-221-91.ngrok-free.app/pending",
      },

      auto_return: "approved",
      notification_url: "https://5617-181-4-221-91.ngrok-free.app/webhook",
      // notification_url: "https://localhost/webhook",
      // notification_url: "https://6c8a-181-28-190-15.ngrok.io/webhook",
      // const webhookUrl = "https://5617-181-4-221-91.ngrok-free.app/webhook";

      external_reference: String(user.id_User),
      // shipments: {
      //   mode: "me2", // Utiliza Mercado Envíos
      //   dimensions: "30x30x30,500",
      //   local_pickup: false, // Si no permites la recogida local
      //   free_methods: [], // Si tienes métodos de envío gratuitos, los especificarías aquí
      //   // Puedes añadir más configuraciones de envío según la documentación
      // },
    };

    const response = await mercadopago.preferences.create(preference);

    res.send({ ...response.body, redirectUrl: response.body.init_point });
  } catch (err) {
    logger.error(err);
    res.status(500).send({ message: "Error interno del servidor." });
  }
};

// Escucha los eventos que llegan del backend de mercado pago,
const recibingWebhook = async (req, res) => {
  const payment = req.body;

  try {
    if (payment.topic && payment.topic === "merchant_order") {
    } else if (payment.type && payment.type === "payment") {
      let data = await mercadopago.payment.findById(payment.data.id);
      const paymentDetails = data.body;

      const paymentData = {
        id_mercado_pago: paymentDetails.charges_details[0].id,
        status: paymentDetails.status,
        status_detail: paymentDetails.status_detail,
        payment_method_id: paymentDetails.payment_method_id,
        payment_type_id: paymentDetails.payment_type_id,
        transaction_amount: paymentDetails.transaction_amount,
        transaction_amount_refunded: paymentDetails.transaction_amount_refunded,
        installments: paymentDetails.installments,
        external_reference: paymentDetails.external_reference,
        payer_id: paymentDetails.payer.id,
        payer_email: paymentDetails.payer.email,
        payer_identification: paymentDetails.payer.identification,
        additional_info: paymentDetails.additional_info,
        date_created: paymentDetails.date_created,
        date_approved: paymentDetails.date_approved,
        date_last_updated: paymentDetails.date_last_updated,
        currency_id: paymentDetails.currency_id,
        description: paymentDetails.description,
        live_mode: paymentDetails.live_mode,
      };

      await Order.create(paymentData);
      const userId = paymentDetails.external_reference;
      await Order.update(
        { ...paymentData, userId: userId },
        { where: { external_reference: userId } }
      );
    } else {
      console.log("Unknown webhook event type.");
    }

    return res.sendStatus(204);
    // }
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: err.message });
  }
};

const Success = async (req, res) => {
  try {
    res.send("Success");
  } catch (err) {
    logger.error(err);
    res.send(err.message);
  }
};
const Failure = async (req, res) => {
  try {
    res.send("Failure");
  } catch (err) {
    logger.error(err);
    res.send(err.message);
  }
};
const Pending = async (req, res) => {
  try {
    res.send("Pending");
  } catch (err) {
    logger.error(err);
    res.send(err.message);
  }
};

const GetPaymentDetails = async (req, res) => {
  const userId = req.params.userId;

  try {
    const orderDetails = await Order.findOne({
      where: { external_reference: userId },
    });

    if (!orderDetails) {
      return res
        .status(404)
        .send({ message: "Detalles del pago no encontrados." });
    }

    res.json(orderDetails);
  } catch (err) {
    logger.error(err);
    console.error("Error al obtener detalles del pago:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
const GetAllPayments = async (req, res) => {
  try {
    const orderDetails = await Order.findAll();

    if (!orderDetails.length) {
      return res
        .status(404)
        .json({ message: "No se encontraron pagos efectuados." });
    }

    res.json(orderDetails);
  } catch (err) {
    logger.error(err);
    console.error("Error al obtener detalles del pago:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  CreateOrder,
  Success,
  recibingWebhook,
  Failure,
  Pending,
  GetPaymentDetails,
  GetAllPayments,
};
