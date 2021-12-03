const express = require("express");

const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductByName,
  getProductByCategory,
  searchProducts,
} = require("../db/products");

const productsRouter = express.Router();

const multer = require("multer");

const upload = multer({ dest: "public/images" });

//==========================================================

productsRouter.get("/", async (req, res) => {
  const products = await getAllProducts();
  res.send(products);
});

//==========================================================

productsRouter.post("/", upload.single("image"), async (req, res, next) => {
  const { name, description, price, stock, category, author } = req.body;
  const image = req.file.filename;
  if (
    !name ||
    !description ||
    !price ||
    !stock ||
    !category ||
    !author ||
    !image
  ) {
    return next({ error: "Missing input field" });
  }

  const nameCheck = await getProductByName(name);
  if (nameCheck) {
    if (nameCheck.name === name) {
      return next({ error: "Another product already exists with this name" });
    }
  }
  const newProduct = await createProduct({
    name,
    description,
    price,
    stock,
    category,
    author,
    image,
  });
  console.log(newProduct);
  res.send(newProduct);
});

//==========================================================

productsRouter.patch(
  "/:productId",
  upload.single("image"),
  async (req, res, next) => {
    const id = req.params.productId;
    const { name, description, price, stock, category, author } = req.body;

    console.log("new price:", price);
    if (!name && !description && !price && !stock && !category && !author) {
      return next({ error: "At least one input field must be filled out" });
    }
    const nameCheck = await getProductByName(name);
    if (nameCheck) {
      if (nameCheck.name === name) {
        return next({ error: "Another product already exists with this name" });
      }
    }
    const editProduct = await updateProduct({
      id,
      name,
      description,
      price,
      stock,
      category,
      author,
    });
    res.send(editProduct);
  }
);

//==========================================================

productsRouter.delete("/:productId", async (req, res) => {
  const id = req.params.productId;
  await deleteProduct(id);
  res.send({ Message: "Product deleted" });
});

//==========================================================

productsRouter.get("/category/:name", async (req, res) => {
  const category = req.params.name;
  console.log(category);
  const product = await getProductByCategory(category);
  res.send(product);
});

//==========================================================

productsRouter.get("/:productId", async (req, res) => {
  const id = req.params.productId;
  const product = await getProductById(id);
  res.send(product);
});

//==========================================================

productsRouter.get("/search/:searchterm", async (req, res) => {
  const searchTerm = req.params.searchterm;
  const products = await searchProducts(searchTerm);
  res.send(products);
});

//==========================================================

module.exports = productsRouter;
