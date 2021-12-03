const { addCartItem } = require("../db/cart_items");
const {
  getCart,
  createOrder,
  updateOrder,
  getPurchaseOrders,
} = require("../db/orders");
const { getProductById, updateProduct } = require("../db/products");

const ordersRouter = require("express").Router();

//==========================================================

ordersRouter.get("/me", async (req, res, next) => {
  if (!req.user) {
    next();
  }
  try {
    const userId = req.user.id;
    const resp = await getPurchaseOrders(userId);
    res.send(resp);
  } catch (error) {
    console.log(error);
  }
});

//==========================================================

ordersRouter.post("/", async (req, res, next) => {
  if (!req.user) {
    next();
  }
  try {
    const userId = req.user.id;
    const newOrder = await createOrder(userId);
    res.send(newOrder);
  } catch (error) {
    console.error(error);
  }
});

//==========================================================

ordersRouter.patch("/:id", async (req, res, next) => {
  if (!req.user) {
    next();
  }
  try {
    const id = req.params.id;
    const user_id = req.user.id;
    const { total, date } = req.body;
    console.log(total, date);
    const cart = await getCart(user_id);
    const products = cart.products;

    for (let product of products) {
      const quantity = product.quantity;
      const productInfo = await getProductById(product.product_id);
      let stock = productInfo.stock;
      stock = productInfo.stock - quantity;
      await updateProduct({ id: product.product_id, stock: stock });
    }

    const orderUpdate = await updateOrder(id, total, date);
    createOrder(user_id);
    res.send(orderUpdate);
  } catch (error) {
    console.log(error);
  }
});

//==========================================================

ordersRouter.get("/cart", async (req, res, next) => {
  if (!req.user) {
    return next();
  }
  try {
    const userId = req.user.id;
    const resp = await getCart(userId);
    console.log(resp);
    res.send(resp);
  } catch (error) {
    console.log(error);
  }
});

//==========================================================

ordersRouter.post("/:id/products", async (req, res, next) => {
  if (!req.user) {
    next();
  }
  try {
    const order_id = req.params.id;
    const { product_id, quantity } = req.body;
    console.log(
      "order id:",
      order_id,
      "product id:",
      product_id,
      "quantity:",
      quantity
    );
    const resp = await addCartItem({
      order_id,
      product_id,
      quantity,
    });
    res.send(resp);
  } catch (error) {
    console.log(error);
  }
});

//==========================================================

module.exports = ordersRouter;
