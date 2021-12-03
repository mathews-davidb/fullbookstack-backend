const client = require("./client");

//==========================================================

const createCategory = async (name) => {
  try {
    const resp = await client.query(
      `
                  INSERT INTO categories(name)
                  VALUES ($1)
                  RETURNING *
                  `,
      [name]
    );
    const category = resp.rows[0];
    return category;
  } catch (error) {
    throw error;
  }
};

// createCategory("biography").then(console.log);

//==========================================================

async function getAllCategories() {
  try {
    const resp = await client.query(
      `
          SELECT * FROM categories
          `
    );
    const categories = resp.rows;
    return categories;
  } catch (error) {
    throw error;
  }
}

// getAllCategories().then(console.log);

//==========================================================

module.exports = { createCategory, getAllCategories };
