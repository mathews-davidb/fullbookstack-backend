const client = require("./client");

//==========================================================

const createProduct = async ({
  name,
  description,
  price,
  stock,
  category,
  author,
  image,
  publisher,
}) => {
  try {
    const resp = await client.query(
      `
                  INSERT INTO products(name, description, price, stock, category, author, image, publisher)
                  VALUES ($1, $2, $3 ,$4, $5, $6, $7, $8)
                  RETURNING *
                  `,
      [name, description, price, stock, category, author, image, publisher]
    );
    const product = resp.rows[0];
    return product;
  } catch (error) {
    throw error;
  }
};

// createProduct({
//   name: "the great gatsby",
//   description: "this is a great book",
//   price: 17.99,
//   stock: 19,
//   category: "fiction",
// }).then(console.log);

//==========================================================

async function getAllProducts() {
  try {
    const resp = await client.query(
      `
          SELECT * FROM products
          `
    );
    const products = resp.rows;
    return products;
  } catch (error) {
    throw error;
  }
}

// getAllProducts().then(console.log);

//==========================================================

async function updateProduct({
  id,
  name,
  description,
  price,
  stock,
  category,
  author,
  image,
}) {
  try {
    if (name) {
      await client.query(
        `
            UPDATE products
            SET name=$2
            where id=$1
            `,
        [id, name]
      );
    }
    if (description) {
      await client.query(
        `
              UPDATE products
              SET description=$2
              where id=$1
              `,
        [id, description]
      );
    }
    if (price) {
      await client.query(
        `
                  UPDATE products
                  SET price=$2
                  where id=$1
                  `,
        [id, price]
      );
    }
    if (stock) {
      await client.query(
        `
                      UPDATE products
                      SET stock=$2
                      where id=$1
                      `,
        [id, stock]
      );
    }
    if (category) {
      await client.query(
        `
                          UPDATE products
                          SET category=$2
                          where id=$1
                          `,
        [id, category]
      );
    }
    if (author) {
      await client.query(
        `
              UPDATE products
              SET author=$2
              where id=$1
              `,
        [id, author]
      );
    }

    if (image) {
      await client.query(
        `
              UPDATE products
              SET image=$2
              where id=$1
              `,
        [id, image]
      );
    }
    const resp = await client.query(
      `
        SELECT * FROM products
        WHERE id=$1
    `,
      [id]
    );

    const product = resp.rows[0];
    console.log(product);
    return product;
  } catch (error) {
    throw error;
  }
}

// updateProduct({
//   id: 2,
//   name: "name2",
//   description: "this is a new book",
//   price: 9.99,
//   stock: 95,
//   category: "fiction",
// }).then(console.log);

//==========================================================

async function deleteProduct(id) {
  try {
    await client.query(
      `
            DELETE FROM products
            WHERE id=$1
            RETURNING *
            `,
      [id]
    );
  } catch (error) {
    throw error;
  }
}

// deleteProduct(22);

//==========================================================

async function getProductById(id) {
  try {
    const resp = await client.query(
      `
                SELECT *
                FROM products
                WHERE id=$1
              `,
      [id]
    );
    const product = resp.rows[0];

    return product;
  } catch (error) {
    throw error;
  }
}

// getProductById(24).then(console.log);

//==========================================================

async function getProductByName(name) {
  try {
    const resp = await client.query(
      `
                SELECT *
                FROM products
                WHERE name=$1
              `,
      [name]
    );
    const product = resp.rows[0];
    // console.log(product);
    return product;
  } catch (error) {
    throw error;
  }
}

//==========================================================

async function getProductByCategory(category) {
  try {
    const resp = await client.query(
      `
                SELECT *
                FROM products
                WHERE lower(category)=$1
              `,
      [category]
    );
    const product = resp.rows;
    // console.log(product);
    return product;
  } catch (error) {
    throw error;
  }
}

//==========================================================

async function searchProducts(searchTerm) {
  searchTerm = `%${searchTerm}%`;
  try {
    const resp = await client.query(
      `
                SELECT *
                FROM products
                WHERE  lower(name || description || author || category) LIKE $1 
               

              `,
      [searchTerm]
    );
    const product = resp.rows;

    return product;
  } catch (error) {
    throw error;
  }
}

//==========================================================

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  getProductById,
  deleteProduct,
  getProductByName,
  getProductByCategory,
  searchProducts,
};
