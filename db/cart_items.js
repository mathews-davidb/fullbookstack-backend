const client = require("./client");
const { getProductById, deleteProduct } = require("./products");

//==========================================================

const addCartItem = async ({ order_id, product_id, quantity }) => {
  console.log(product_id);
  const product = await getProductById(product_id);
  const price = product.price;
  const name = product.name;
  const image = product.image;
  // console.log(price);
  try {
    const resp = await client.query(
      `
        INSERT INTO cart_items (order_id, product_id, price, quantity, product_name, product_image)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
        `,
      [order_id, product_id, price, quantity, name, image]
    );
    const cart_item = resp.rows[0];
    return cart_item;
  } catch (error) {
    throw error;
  }
};

// addProductToOrder({ order_id: 1, product_id: 1, quantity: 1 }).then(
//   console.log
// );

//==========================================================

const deleteCartItem = async (id) => {
  try {
    await client.query(
      `
          DELETE FROM cart_items
          WHERE id = $1
          `,
      [id]
    );
  } catch (error) {
    throw error;
  }
};

// deleteProductFromOrder(2);

//==========================================================

async function updateCartItem({ id, quantity }) {
  try {
    if (quantity) {
      await client.query(
        `
                        UPDATE cart_items
                        SET quantity=$2
                        where id=$1
                        `,
        [id, quantity]
      );
    }
    const resp = await client.query(
      `
          SELECT * FROM cart_items
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

// updateCartItem({
//   id: 5,
//   quantity: 3,
// }).then(console.log);

//==========================================================

module.exports = { addCartItem, deleteCartItem, updateCartItem };
