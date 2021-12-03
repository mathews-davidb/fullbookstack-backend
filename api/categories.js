const express = require("express");

const { getAllCategories } = require("../db/categories");

const categoriesRouter = express.Router();

//==========================================================

categoriesRouter.get("/", async (req, res) => {
  const categories = await getAllCategories();
  res.send(categories);
});

//==========================================================

//==========================================================

module.exports = categoriesRouter;
