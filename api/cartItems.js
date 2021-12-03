const cartItemsRouter = require("express").Router();

const { updateCartItem, deleteCartItem } = require("../db/cart_items");

//==========================================================

cartItemsRouter.patch("/:cartItemId", async (req, res) => {
  const { quantity } = req.body;
  const id = req.params.cartItemId;

  console.log(quantity, id);
  const updated = await updateCartItem({
    id,
    quantity,
  });
  res.send(updated);
});

//==========================================================

cartItemsRouter.delete("/:cartItemId", async (req, res) => {
  const id = req.params.cartItemId;
  const updated = await deleteCartItem(id);
  res.send(updated);
});

//==========================================================

module.exports = cartItemsRouter;
