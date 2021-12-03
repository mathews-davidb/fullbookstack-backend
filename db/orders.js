const client = require("./client");

//==========================================================

const createOrder = async (userId) => {
  const resp = await client.query(
    `
        INSERT INTO orders (user_id)
        VALUES ($1)
        RETURNING *;
        `,
    [userId]
  );
  const order = resp.rows[0];
  return order;
};

// createOrder(1).then(console.log);

//==========================================================

const updateOrder = async (id, total, date) => {
  console.log(id, total, date);
  const resp = await client.query(
    `
          UPDATE orders 
          SET is_purchase = true, total = $2, date = $3
          WHERE id = $1
          RETURNING *;
          `,
    [id, total, date]
  );
  const order = resp.rows[0];
  return order;
};

// updateOrder(1);

//==========================================================

const getPurchaseOrders = async (user_id) => {
  try {
    const resp = await client.query(
      `
                        SELECT * FROM orders
                        WHERE is_purchase = true AND user_id = $1;
        
                      `,
      [user_id]
    );

    const orders = resp.rows;
    if (!orders) {
      return;
    }
    for (let order of orders) {
      const resp = await client.query(
        `
        SELECT * FROM cart_items 
        WHERE "order_id" = $1
        
                      `,
        [order.id]
      );
      const products = resp.rows;
      order.products = products;
    }
    return orders;
  } catch (error) {
    throw error;
  }
};

//==========================================================

const getCart = async (user_id) => {
  try {
    const resp = await client.query(
      `
                        SELECT * FROM orders
                        WHERE is_purchase = false AND user_id = $1;
        
                      `,
      [user_id]
    );

    const cart = resp.rows[0];
    if (!cart) {
      return;
    }
    const data = await client.query(
      `
                        SELECT * FROM cart_items 
                        WHERE "order_id" = $1
        
                      `,
      [cart.id]
    );
    const products = data.rows;
    cart.products = products;

    return cart;
  } catch (error) {
    throw error;
  }
};

//==========================================================

module.exports = { createOrder, getCart, getPurchaseOrders, updateOrder };
