const client = require("./client");
const { createOrder } = require("./orders");
const { createProduct } = require("./products");
const { createUser, getUser } = require("./users");
const { createCategory } = require("./categories");

const faker = require("faker");
const axios = require("axios");

async function dropTables() {
  try {
    await client.query(`
    DROP TABLE IF EXISTS cart_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS categories;
    `);
  } catch (error) {
    throw error;
  }
}

async function createTables() {
  try {
    await client.query(`
    CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
    );
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      description VARCHAR(10000),
      author VARCHAR(255) NOT NULL,
      publisher VARCHAR (255),
      price DECIMAL NOT NULL,
      image VARCHAR(3000) UNIQUE,
      stock INTEGER NOT NULL,
      category VARCHAR(255) REFERENCES categories(name) ON DELETE CASCADE
    );
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN DEFAULT false
      );
    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      total DECIMAL DEFAULT 0.00,
      date DATE DEFAULT NULL,
      is_purchase BOOLEAN DEFAULT false
    );
    CREATE TABLE cart_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        product_name VARCHAR(255) REFERENCES products(name),
        product_image VARCHAR(3000) REFERENCES products(image),
        price DECIMAL NOT NULL,
        quantity INTEGER NOT NULL,
        UNIQUE(product_id, order_id)
      );
    `);
  } catch (error) {
    throw error;
  }
}

async function seedValues() {
  for (i = 0; i < 10; i++) {
    const name = faker.name.findName();
    const email = (
      name.split(" ")[0] +
      "." +
      name.split(" ")[1] +
      "@email.com"
    ).toLowerCase();
    createUser({ email: email, name: name, password: "password" });
  }
}

createUser({
  email: "david@me.com",
  name: "David Mathews",
  password: "password",
});
createUser({
  email: "josue@me.com",
  name: "Josue Vado",
  password: "password",
});
createUser({
  email: "leslie@me.com",
  name: "Leslie Bradford",
  password: "password",
});
createUser({
  email: "daniel@me.com",
  name: "Daniel Schneider",
  password: "password",
});

const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

const seedProducts = async () => {
  try {
    await axios
      .get(
        "https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=bYXKRa8vHpJZn0WEWdSrD1pK74e6AjEp"
      )
      .then(async (response) => {
        const categories = response.data.results;

        for (let category of categories) {
          $: categoryName = category.display_name;
          if (category.display_name.includes("Fiction")) {
            createCategory("Fiction");
            categoryName = "Fiction";
          } else if (category.display_name.includes("Nonfiction")) {
            createCategory("Nonfiction");
            categoryName = "Nonfiction";
          } else if (category.display_name.includes("Advice")) {
            createCategory("Advice");
            categoryName = "Advice";
          } else if (category.display_name.includes("Graphic")) {
            createCategory("Graphic");
            categoryName = "Graphic";
          } else if (
            category.display_name.includes("Children") ||
            category.display_name.includes("Middle Grade")
          ) {
            createCategory("Children");
            categoryName = "Children";
          } else if (category.display_name.includes("Young Adult")) {
            createCategory("Young Adult");
            categoryName = "Young Adult";
          } else if (category.display_name.includes("Business")) {
            createCategory("Business");
            categoryName = "Business";
          } else createCategory(category.display_name);
          await sleep(5000);
          axios
            .get(
              `https://api.nytimes.com/svc/books/v3/lists/${category.list_name_encoded}.json?api-key=bYXKRa8vHpJZn0WEWdSrD1pK74e6AjEp`
            )
            .then(async (response) => {
              const books = response.data.results.books;
              for (let book of books) {
                const price =
                  (Math.floor(Math.random() * (2500 - 1500 + 100)) + 1500) /
                  100;
                createProduct({
                  name: book.title,
                  description: book.description,
                  price: price,
                  stock: 100,
                  publisher: book.publisher,
                  category: categoryName,
                  author: book.author,
                  image: book.book_image,
                });
                console.log(book.title);
              }
            });
        }
      });
  } catch (error) {
    throw error;
  }
};

seedProducts();
dropTables();
createTables();
seedValues();

console.log("working");
