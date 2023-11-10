const mercadopago = require("mercadopago");
const Products = require("../models/products.js");
const Order = require("../models/Order.js");
require("dotenv").config();

mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_TOKEN,
});

const CreateOrder = async (req, res) => {
  const { cart, total, user } = req.body;
  let serverTotal = 0;

  try {
    // 1. Validación:
    for (let item of cart) {
      const productFromDB = await Products.findByPk(item.id_Product);
      if (!productFromDB) {
        return res.status(400).send({
          error: "Producto no encontrado.",
          productId: item.id_Product,
        });
      }
      if (productFromDB.price !== item.price) {
        return res
          .status(400)
          .send({ message: "El precio del producto no coincide." });
      }
      if (productFromDB.stock < item.quantity) {
        return res
          .status(400)
          .send({ message: "No hay suficiente stock del producto." });
      }
      serverTotal += productFromDB.price * item.quantity;
      // console.log(serverTotal);
    }

    if (serverTotal !== total) {
      return res.status(400).send({
        message: "El total enviado no coincide con el total calculado.",
      });
    }

    const items = cart.map((product) => ({
      id_Product: product.id_Product,
      title: product.name,
      unit_price: product.price,
      quantity: product.quantity,
      currency_id: "ARS",
    }));

    const preference = {
      items: items,
      // ACTUALIZAR ESTAR URLS HARCODEADAS
      back_urls: {
        success: "http://localhost:3000/approved",
        failure: "http://localhost:3000/failure",
        pending: "http://localhost:4000/pending",
      },

      auto_return: "approved",
      notification_url: "https://8dc9-181-28-190-15.ngrok.io/webhook",
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
    console.error(err);
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
      // console.log(paymentData);
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
    console.error("Error while processing webhook:", err.message);
    return res.status(500).json({ error: err.message });
  }
};

const Success = async (req, res) => {
  try {
    res.send("Success");
    console.log(
      "AKAAA ESTA EL AMLDITO SUCCESSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS"
    );
  } catch (err) {
    res.send(err.message);
  }
};
const Failure = async (req, res) => {
  try {
    res.send("Failure");
    console.log("failure");
  } catch (err) {
    res.send(err.message);
  }
};
const Pending = async (req, res) => {
  try {
    res.send("Pending");
    console.log("pending");
  } catch (err) {
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
};
