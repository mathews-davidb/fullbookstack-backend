const apiRouter = require("express").Router();
require("dotenv").config();
const { JWT_SECRET } = process.env;

apiRouter.get("/health", (req, res) => {
  res.send({ message: "Server is working" });
});

const ordersRouter = require("./orders");
apiRouter.use("/orders", ordersRouter);

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const productsRouter = require("./products");
apiRouter.use("/products", productsRouter);

// const reviewsRouter = require("./reviews");
// apiRouter.use("/reviews", reviewsRouter);

const cartItemsRouter = require("./cartItems");
apiRouter.use("/cartItems", cartItemsRouter);

const categoriesRouter = require("./categories");
apiRouter.use("/categories", categoriesRouter);

apiRouter.use((error, req, res, next) => {
  res.send(error);
});

module.exports = apiRouter;
